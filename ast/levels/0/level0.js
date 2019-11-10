'use strict';

let levelTemplate;

Level = {
    css: `ast/levels/0/level0.css`,

    // Text section
    name: {
        en: "This is test Level for prototyping purpose only",
        ru: "Это тестовый уровень для прототипизации",
    },

    text: {
        level0_h1: {
            en: "Test Level Template",
            ru: "Шаблон тестового уровня",
        },
        level0_p: {
            en: "Lorem Ipsum Fuckipsum",
            ru: "Лорем Ипсум Хуипсум",
        }
    }
};


Level.template =
`<div>
    <h1 id="level0_h1"></h1>
    <p id="level0_p"></p>
</div>
`;
