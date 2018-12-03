import fetch from 'node-fetch';

/**
 * @todo need to authorise
 * @todo add elvis operator from babel 7
 *
 * @param entityType
 * @param bundle
 * @param id
 * @param includeRelationships
 * @returns {Promise<{}>}
 */
async function read (entityType, bundle, id, {
  includeRelationships = true,
} = {}) {
  try {
    let relationships = [];
    if (includeRelationships) {
      const schemaDataJson = await fetch(`${config.drupal.url}/schemata/${entityType}/${bundle}?_format=schema_json&_describes=api_json`);
      const schemaData = await schemaDataJson.json();
      if (schemaData.properties.relationships.properties) {
        relationships = Object.keys(schemaData.properties.relationships.properties);
      }
    }
    const entityJson = await fetch(`${config.drupal.url}/jsonapi/${entityType}/${bundle}/${id}?include=${relationships.join(',')}`);
    const entity = await entityJson.json();
    let included = {};
    if (entity.included) {
      included = Object.values(entity.included).reduce((acc, val) => { acc[val.id] = val; delete acc[val.id].links; return acc; }, {});
    }
    delete entity.data.links;

    return {
      [entity.data.id]: entity.data,
      ...included,
    };
  }
  catch (e) {
    console.log(e);
  }
  return null;
}

export default read;
