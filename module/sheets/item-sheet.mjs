import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ExaltedSecondItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['exaltedsecond', 'sheet', 'item'],
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = 'systems/exaltedsecond/templates/item';
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = this.item.getRollData();

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    html.on('click', '.resources-radio', this._onResourceChange.bind(this));

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );
  }

  _onResourceChange(event) {
    event.preventDefault()
    const element = event.currentTarget
    if ($(element).prop('readonly')) {
      return;
    }
    const parent = $(element.parentNode);
    const fieldStrings = $(parent).attr('name');
    var val = $(element).data('index') + 1;
    // const oldVal = foundry.utils.getProperty(this.item, fieldStrings);
    // const min = foundry.utils.getProperty(this.item, fieldStrings.replace("value", "min"));
    // console.log(val);
    // console.log(oldVal);
    // console.log(min);
    // if (val == 1 && oldVal == 1 && min == 0) {
    //   val = 0;
    // }
    // console.log(val);
    this.item.update({[fieldStrings]: val});
    // console.log(this.item);
  }
}

