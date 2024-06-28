export default class ExaltedSecondActorBase extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    // schema.health = new fields.SchemaField({
    //   value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
    //   max: new fields.NumberField({ ...requiredInteger, initial: 10 })
    // });
    // schema.power = new fields.SchemaField({
    //   value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
    //   max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    // });
    // schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields

    schema.settings = new fields.SchemaField({
      lockAttributes: new fields.BooleanField({ required: true, initial: true }),
      lockAbilities: new fields.BooleanField({ required: true, initial: false }),
      lockSpecialties: new fields.BooleanField({ required: true, initial: false })
    });

    schema.concept = new fields.StringField({ required: true, blank: true });
    schema.age = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

    schema.biography = new fields.SchemaField(Object.keys(CONFIG.EXALTED_SECOND.biography).reduce((obj, bio) => {
      obj[bio] = new fields.SchemaField({
        value: new fields.StringField({ required: false, blank: true })
      });
      return obj;
    }, {}));

    schema.attributes = new fields.SchemaField(Object.keys(CONFIG.EXALTED_SECOND.attributes).reduce((obj, attribute, idx) => {
      obj[attribute] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 5 }),
        min: new fields.NumberField({ ...requiredInteger, initial: 1 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 5, max: 5 }),
        type: new fields.StringField({ required: true, blank: true }),
        fav: new fields.BooleanField({ required: true, initial: false }) // For Lunars, one day...
      });
      return obj;
    }, {}));

    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.EXALTED_SECOND.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
        min: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 5, max: 5 }),
        row: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        caste: new fields.StringField({ required: true, blank: true }),
        fav: new fields.BooleanField({ required: true, initial: false }),
        // Solar fields
        solar1stExcellency: new fields.BooleanField({ required: true, initial: false }),
        solar2ndExcellency: new fields.BooleanField({ required: true, initial: false }),
        solar3rdExcellency: new fields.BooleanField({ required: true, initial: false }),
        solarInfiniteMastery: new fields.BooleanField({ required: true, initial: false }),
        solarEssenceFlow: new fields.BooleanField({ required: true, initial: false })
      });
      return obj;
    }, {}));

    return schema;
  }
}