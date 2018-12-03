//import config from 'config';
import fetch from 'node-fetch';
const config = {
  drupal: {
    url: 'http://127.0.0.1:8888',
  },
};

/**
export async const getEntityTypes = () => {
  try {
    const listingJson = await fetch(`${config.drupal.url}/jsonapi`);
    const listing = await listingJson.json();
    return Object.keys(listing.links)
      .filter(link => link.includes('--'))
      .map(link => link.substr(0, link.indexOf('--')))
      .reduce((acc, val) => {
        if (!acc.includes(val)) {
          acc.push(val);
        }
        return acc;
      }, []);
  }
  catch (e) {}
};
export async const getBundles = (entityType) => {
  try {
    const listingJson = await fetch(`${config.drupal.url}/jsonapi`);
    const listing = await listingJson.json();
    return Object.keys(listing.links)
      .filter(link => link.includes('--'))
      .filter(link => link.substr(0, entityType.length + 2) === `${entityType}--`)
      .map(link => link.substr(link.indexOf('--') + 2))
      .filter(bundle => bundle !== entityType);
  }
  catch (e) {
  }
  catch (e) {}
};

export const createEntity = (entityType, id, {
  includeAllRelationships = true,
}) => true;

 **/
/**
 * @todo need to authorise
 * @todo add elvis operator from babel 7
 *
 * @param entityType
 * @param bundle
 * @param id
 * @param includeAllRelationships
 * @returns {Promise<{}>}
 */
export async function read (entityType, bundle, id, {
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

/**
export const updateEntity = (entityType, id) => true;
export const deleteEntity = (entityType, id) => true;
**/
read('node', 'article', '699a2488-8d95-4425-a273-ca55a50aa641').then(resp => {
  console.log(resp);
});

export default {
  read,
};
