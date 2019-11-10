'use strict';


// Store
const store = new Vuex.Store({
    state: {
        language: "EN",
        titleText: 'Little Life',
        languageButtonClasses: { 'language-button': true, 'rus': false },
        player: {},
        level: {},
        level_loading: false,
        greeting: "Hello!",
    },

    mutations: {
        changeLanguage: (state) => {
            state.language = state.language === 'EN' ? 'RU' : 'EN';
        },
        loadLevel: (state, value) => {
            state.level_loading = value;
        },
        setLevel: (state) => {
            state.level = Level;
        },
        updateLanguage: (state) => {
            let EN = state.language === 'EN';
            state.titleText = EN ? 'Little Life' : 'Маленькая Жизнь';
            state.languageButtonClasses.rus = !EN;
            state.level.intro.now = EN ? state.level.intro.en : state.level.intro.ru;
            state.greeting = EN ? "Hello!" : "Привет!";
        },
        updatePlayer: (state, obj) => {
            for (let key in obj) {
                state.player[key] = obj[key];
            }
        }
    },

    actions: {
        changeLanguage: ({commit, state}) => {
            commit('changeLanguage');
            commit('updateLanguage');
        },

        loadPlayer: ({commit}) => new Promise((resolve, reject) => {
            setTimeout(() => {
                let player = { name: 'Romano', stage: 0, chances: 3 };
                commit('updatePlayer', player);
                resolve();
            }, 10);
        }),

        loadLevel: ({commit, state}) => {
            new Promise((upper_resolve, upper_reject) => {
                new Promise((lower_resolve, lower_reject) => {
                    current_level_script.src = "levels/level" + state.player.stage + ".js";
                    current_level_script.onload = () => lower_resolve();
                }).then(()=>{
                    commit('setLevel');
                    upper_resolve();
                })
            }).then(() => {
                current_level_style.innerHTML = state.level['css'];
                commit('updateLanguage');
                commit('loadLevel', true);
            })
        },
        night: () => lifegame.classList.toggle('night'),
    }
})


// App
const app = new Vue({
    el: '#lifegame-app',
    store,

    computed: {
        ...Vuex.mapState({
            language: 'language',
            titleText: 'titleText',
            LBC: 'languageButtonClasses',
            greet: 'greeting',
            levelName: (state) => state.level.intro && state.level.intro.now,
        }),
    },

    watch: {
        titleText: (newTitleText) => {
            title.textContent = newTitleText;
        },
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
    <h2>{{levelName || greet}}</h2>
    <button :class='LBC' @click='changeLanguage'>{{language}}</button>
    <button @click='night'>Night</button>
</div>
`
})

let Level = {};
