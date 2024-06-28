import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ExaltedSecondActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['exaltedsecond', 'sheet', 'actor'],
      width: 640,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/exaltedsecond/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // // Prepare character data and items.
    // if (actorData.type == 'character') {
    //   this._prepareItems(context);
    //   this._prepareCharacterData(context);
    // }

    // // Prepare NPC data and items.
    // if (actorData.type == 'npc') {
    //   this._prepareItems(context);
    // }

    // Prepare generic data and items
    this._prepareItems(context);
    this._prepareData(context);

    // Prepare Solar data and items.
    if (actorData.type == 'solar') {
      // Nothing for now
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    // for (let [k, v] of Object.entries(context.system.abilities)) {
    //   v.label = game.i18n.localize(CONFIG.EXALTED_SECOND.abilities[k]) ?? k;
    // }
  }

/**
   * Organize and classify Items for Solar sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
_prepareData(context) {
  for (let [k, v] of Object.entries(context.system.biography)) {
    v.label = game.i18n.localize(CONFIG.EXALTED_SECOND.biography[k]) ?? k;
  }
  for (let [k, v] of Object.entries(context.system.attributes)) {
    v.label = game.i18n.localize(CONFIG.EXALTED_SECOND.attributes[k]) ?? k;
  }
  for (let [k, v] of Object.entries(context.system.abilities)) {
    v.label = game.i18n.localize(CONFIG.EXALTED_SECOND.abilities[k]) ?? k;
  }
}

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareOldItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  _prepareItems(context) {
    // const spells = {
    //   0: [],
    //   1: [],
    //   2: [],
    //   3: [],
    //   4: [],
    //   5: [],
    //   6: [],
    //   7: [],
    //   8: [],
    //   9: [],
    // };

    const specialties = {
      // '': [],
      'Archery': [],
      'MartialArts': [],
      'Melee': [],
      'Thrown': [],
      'War': [],
      'Integrity': [], 
      'Performance': [],
      'Presence': [],
      'Resistance': [],
      'Survival': [],
      'Craft': [],
      'Investigation': [],
      'Lore': [],
      'Medicine': [],
      'Occult': [],
      'Athletics': [],
      'Awareness': [],
      'Dodge': [],
      'Larceny': [],
      'Stealth': [],
      'Bureaucracy': [],
      'Linguistics': [],
      'Ride': [],
      'Sail': [],
      'Socialise': []
    };
     console.log(context.items);
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      if (i.type === 'specialty') {
        // console.log(i.system);
        if (i.system.ability != undefined) {
          // console.log(specialties);
          if (specialties[i.system.ability]) {
            specialties[i.system.ability].push(i);
          }
          else {
            specialties[''].push(i);
          }
        }
      } 
      // else if (i.type === 'spell') {
      //   if (i.system.spellLevel != undefined) {
      //     spells[i.system.spellLevel].push(i);
      //   }
      // }
    }
    
    // context.spells = spells;
    context.specialties = specialties;

    console.log(specialties);
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    html.on('click', '.resources-radio', this._onResourceChange.bind(this));

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }

    html.on('click', '.mylock', (ev) => {
      let item =$(ev.currentTarget); 
      let val = $(item).data('val');
      switch (val) {
        case 'Attributes':
          this.actor.update({'system.settings.lockAttributes': !this.actor.system.settings.lockAttributes});
        break;

        case 'Abilities':
          this.actor.update({'system.settings.lockAbilities': !this.actor.system.settings.lockAbilities});
        break;

        case 'Specialties':
          this.actor.update({'system.settings.lockSpecialties': !this.actor.system.settings.lockSpecialties});
        break;

        default:
          return;
      }
      if ($(item).hasClass('fa-lock')) {
        $(item).addClass('fa-lock-open');
        $(item).removeClass('fa-lock');
      }
      else {
        $(item).addClass('fa-lock');
        $(item).removeClass('fa-lock-open');
      }
    });
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    if (type == 'specialty') {
      data.ability = $(header).data('specialty-ability');
    }
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
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
    const oldVal = foundry.utils.getProperty(this.actor, fieldStrings);
    const min = foundry.utils.getProperty(this.actor, fieldStrings.replace("value", "min"));
    if (val == 1 && oldVal == 1 && min == 0) {
      val = 0;
    }
    this.actor.update({[fieldStrings]: val});
  }

  // _assignToActorField(fields, value) {
  //   const actorData = foundry.utils.duplicate(this.actor)
  //   // update actor owned items
  //   if (fields.length === 2 && fields[0] === 'items') {
  //     for (const i of actorData.items) {
  //       if (fields[1] === i._id) {
  //         i.data.points = value
  //         break
  //       }
  //     }
  //   } else {
  //     const lastField = fields.pop()
  //     if (fields.reduce((data, field) => data[field], actorData)[lastField] === 1 && value === 1) {
  //       fields.reduce((data, field) => data[field], actorData)[lastField] = 0;
  //     }
  //     else {
  //       fields.reduce((data, field) => data[field], actorData)[lastField] = value
  //     }
  //   }
  //   this.actor.update(actorData)
  // }
}
