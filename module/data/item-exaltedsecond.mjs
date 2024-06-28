import ExaltedSecondItemBase from "./item-base.mjs";

export default class ExaltedSecondSpecialty extends ExaltedSecondItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.ability = new fields.StringField({ required: true, nullable: false, initial: '' });
    schema.value = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 3 })

    return schema;
  }
}