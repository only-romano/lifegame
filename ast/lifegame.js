'use strict';

// Placeholders for level's code
const MLL_SCRIPT = document.getElementById("mll_script");
const MLL_STYLE = document.getElementById("mll_style");


// Store
const store = new Vuex.Store({
    state: {
        language: "EN",
        titleText: 'Little Life',
        languageButtonClasses: { 'language-button': true, 'rus': false },
        player: {},
        level: {},
        levelName: "",
        greeting: "Hello!",
    },

    mutations: {
        changeLanguage: (state) => {
            state.language = state.language === 'EN' ? 'RU' : 'EN';
        },
        loadLevel: (state) => {
        },
        setLevel: (state) => {
            state.level = Level;
        },
        updateLanguage: (state) => {
            let EN = state.language === 'EN';
            state.titleText = EN ? 'Little Life' : 'Маленькая Жизнь';
            state.languageButtonClasses.rus = !EN;
            state.greeting = EN ? "Hello!" : "Привет!";
            state.levelName = EN ? state.level.name.en : state.level.name.ru;
            let text = state.level.text;
            for (let el in text) {
                let element = document.getElementById(el);
                element.textContent = EN ? text[el].en : text[el].ru;
            }
        },
        updatePlayer: (state, obj) => {
            for (let key in obj) {
                state.player[key] = obj[key];
                if (key == "lang") {
                    state.language = obj[key];
                }
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
                let player = { name: 'Romano', stage: 0, lang: "RU" };
                commit('updatePlayer', player);
                resolve();
            }, 10);
        }),

        loadLevel: ({commit, state}) => {
            new Promise((upper_resolve, upper_reject) => {
                new Promise((lower_resolve, lower_reject) => {
                    let num = state.player.stage;
                    MLL_SCRIPT.src = `ast/levels/${num}/level${num}.js`;
                    MLL_SCRIPT.onload = () => lower_resolve();
                }).then(()=>{
                    commit('setLevel');
                    upper_resolve();
                })
            }).then(() => {
                mll_level.innerHTML = state.level.template;
                MLL_STYLE.href = state.level.css;
                commit('updateLanguage');
            })
        },
        night: () => mll_level.classList.toggle('night'),
    }
})


// App
const MY_LITTLE_LIFE = new Vue({
    el: '#my-little-life-app',
    store,

    computed: {
        ...Vuex.mapState([
            'language', 'titleText', 'languageButtonClasses', 'greeting', 'levelName',
            ,
        ]),
    },

    watch: {
        titleText: (newTitleText) => {
            let title = document.getElementsByTagName('title')[0];
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
<div id="mll_wrapper">
    <button :class='languageButtonClasses' @click='changeLanguage'>{{language}}</button>
    <h2 id="mll_levelname">{{levelName || greeting}}</h2>
    <div id="mll_level"></div>
    <button id="test_button" @click='night'>Night</button>
</div>
`
})

let Level = {};
