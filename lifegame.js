'use strict';


// Store
const store = new Vuex.Store({
    state: {
        language: "EN",
        titleText: 'Little Life',
        languageButtonClasses: { 'language-button': true, 'rus': false },
        player: {},
        level: {},
    },

    mutations: {
        changeLanguage: (state, language) => {
            state.language = language ? 'EN' : 'RU';
        },
        changeTitleText: (state, language) => {
            state.titleText = language ? 'Little Life' : 'Маленькая Жизнь';
        },
        languageButtonSwitchRusClass: (state, language) => {
            state.languageButtonClasses.rus = !language;
        },
        loadLevel: (state) => {
            state.level.stage = state.player.stage;
            console.log(state.level.stage);
        },
        updatePlayer: (state, obj) => {
            for (let key in obj) {
                state.player[key] = obj[key];
            }
        }
    },

    actions: {
        changeLanguage: ({commit, state}) => {
            let language = state.language === 'RU';
            commit('changeLanguage', language);
            commit('changeTitleText', language);
            commit('languageButtonSwitchRusClass', language);
        },

        loadPlayer: ({commit}) => new Promise((resolve, reject) => {
            setTimeout(() => {
                let player = { name: 'Romano', stage: 0, chances: 3 };
                commit('updatePlayer', player);
                resolve();
            }, 10);
        }),

        loadLevel: ({commit}) => commit('loadLevel'),
        night: () => lifegame.classList.toggle('night'),
    }
})


// App
const app = new Vue({
    el: '#lifegame-app',
    store,

    computed: {
        ...Vuex.mapState([
            'language', 'titleText', 'languageButtonClasses',
        ]),
    },

    watch: {
        titleText: (newTitleText) => {
            title.textContent = newTitleText;
        }
    },

    methods: {
        ...Vuex.mapActions([
            'changeLanguage', 'night', 'loadPlayer', 'loadLevel',
        ]),
    },

    beforeMount() {
        store.dispatch('loadPlayer').then(() => {
            store.dispatch('loadLevel');
        })
    },

    template:`
<div id="lifegame">
    <h2>{{titleText}}</h2>
    <button :class='languageButtonClasses' @click='changeLanguage'>{{language}}</button>
    <button @click='night'>Night</button>
</div>
`
})
