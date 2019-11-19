'use strict'
document.addEventListener('DOMContentLoaded', function () {
    // eslint-disable-next-line no-undef
    ymaps.ready(init)

    function init () {
        // eslint-disable-next-line no-undef
        const myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 7
        })
        console.log(myMap)
    }
})
