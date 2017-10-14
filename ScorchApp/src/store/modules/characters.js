import { CharacterService } from 'services'
import sortBy from 'lodash/sortBy'
import * as types from '../mutation-types'

// initial state
const state = {
    party: []
}

// getters
const getters = {
    myParty: state => state.party,
    getCharacterById: (state, getters) => (id) => {
        return state.party.find(char => char.CharacterId === id);
    },
    getCharacterInventory: (state, getters) => (id) => {
        return state.party.find(char => char.CharacterId === id).Inventory;
    },
    getCharacterWeapons: (state, getters) => (id) => {
        let inventory = state.party.find(char => char.CharacterId === id).Inventory;
        return inventory.filter(item => item.ItemClass === 'Weapon');
    },
    getCharacterArmors: (state, getters) => (id) => {
        let inventory = state.party.find(char => char.CharacterId === id).Inventory;
        return inventory.filter(item => item.ItemClass === 'Armor');
    },
    getCharacterAdventurerGears: (state, getters) => (id) => {
        let inventory = state.party.find(char => char.CharacterId === id).Inventory;
        return inventory.filter(item => item.ItemClass === 'AdventurerGear');
    },
    getCharacterQuivers: (state, getters) => (id) => {
        let inventory = state.party.find(char => char.CharacterId === id).Inventory;
        return inventory.filter(item => item.ItemClass === 'Quiver');
    },
    getCharacterEquipment: (state, getters) => (id) => {
        return state.party.find(char => char.CharacterId === id).Equipment || { };
    }
}

// actions
const actions = {
    async getParty({ commit }) {
        let response = await CharacterService.getParty();
        let myParty = sortBy(response.body, (c) => c.Firstname);
        commit(types.GET_PARTY, myParty);
    },
    async updateCharacter({ commit }, payload) {
        let response = await CharacterService.patchCharacter(payload.characterId, payload.body);
        if(response.status === 200){
            commit(types.PATCH_CHARACTER, payload);
        }
    },
    async addSpell({ commit }, payload) {
        let response = await CharacterService.putCharacterSpell(payload.characterId, payload.body);
        if(response.status === 200){
            payload.addedSpell = response.body;
            commit(types.ADD_SPELL, payload);
        }
    },
    equipItem({ commit }, payload) {
        let characterId = payload.characterId;
        let equipment = getters.getCharacterEquipment(characterId);
        equipment.MainHand = payload.item;
        payload.equipment = equipment;
        commit(types.EQUIP_ITEM, payload);
    }
}

// mutations
const mutations = {
    [types.GET_PARTY] (state, party) {
        state.party = party;
    },
    [types.PATCH_CHARACTER] (state, payload) {
        let id = payload.characterId;
        let props = payload.body;

        for(let i = 0; i < state.party.length; i++) {
            let ch = state.party[i];
            if(ch.CharacterId === id) {
                for(let key in props) {
                    ch[key] = props[key];
                }
            break;                
            }
        }
    },
    [types.ADD_SPELL] (state, payload) {
        let id = payload.characterId;
        let equipment = payload.addedSpell;

        for(let i = 0; i < state.party.length; i++) {
            let ch = state.party[i];
            if(ch.CharacterId === id) {
                ch.Spells.push(spell);
                state.party[i].Spells = sortBy(ch.Spells, (s) => s.Name);
                break;                
            }
        }
    }, 
    [types.EQUIP_ITEM] (state, payload) {
        let id = payload.characterId;
        let equipment = payload.equipment;

        for(let i = 0; i < state.party.length; i++) {
            let ch = state.party[i];
            if(ch.CharacterId === id) {
                ch.Equipment = equipment;
                break;                
            }
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
