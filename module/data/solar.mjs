import ExaltedSecondActorBase from "./actor-base.mjs";

export default class ExaltedSecondSolar extends ExaltedSecondActorBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        // for (var abi in schema.abilities.fields) {
        //     console.log(abi);
        //     console.log(abi.fields);
        // }
        // schema.abilities.reduce((obj, ability) => {
        //     console.log(obj[ability]);
        // });

        return schema;
    }

    prepareDerivedData() {
        for (const key in this.biography) {
            this.biography[key].label = game.i18n.localize(CONFIG.EXALTED_SECOND.biography[key]) ?? key;
        }

        var contAtType = 0;

        for (const key in this.attributes) {
            if (contAtType < 3) {
                this.attributes[key].type = "Physical";
            }
            else if (contAtType < 6) {
                this.attributes[key].type = "Social";
            }
            else if (contAtType < 9) {
                this.attributes[key].type = "Mental";
            }
            this.attributes[key].label = game.i18n.localize(CONFIG.EXALTED_SECOND.attributes[key]) ?? key;
            contAtType++;
        }

        var contAbRow = 0;
        var contAbCaste = 0;

        for (const key in this.abilities) {
            if (contAbRow >= 15) {
                this.abilities[key].row = 1;
            }
            if (contAbCaste < 5) {
                this.abilities[key].caste = "Dawn";
            }
            else if (contAbCaste < 10) {
                this.abilities[key].caste = "Zenith";
            }
            else if (contAbCaste < 15) {
                this.abilities[key].caste = "Twilight";
            }
            else if (contAbCaste < 20) {
                this.abilities[key].caste = "Night";
            }
            else if (contAbCaste < 25) {
                this.abilities[key].caste = "Eclipse";
            }
            this.abilities[key].label = game.i18n.localize(CONFIG.EXALTED_SECOND.abilities[key]) ?? key;
            contAbRow++;
            contAbCaste++;
        }
    }

    getRollData() {
        const data = {};

        if (this.biography) {
            for (let [k,v] of Object.entries(this.biography)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        if (this.attributes) {
            for (let [k,v] of Object.entries(this.attributes)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        if (this.abilities) {
            for (let [k,v] of Object.entries(this.abilities)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        return data;
    }
}