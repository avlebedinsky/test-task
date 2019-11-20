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

    const $cartSubject = document.querySelectorAll('.cart-subject')
    for (const node of $cartSubject) {
        node.addEventListener('click', (event) => {
            event.preventDefault()
            const tagName = event.target.tagName.toLowerCase()
            console.log(tagName)
            if (tagName === 'a') {
                console.log('work')
                node.classList.toggle('active')
            }
        })
    }

    class Component {
        constructor (id) {
            this.$node = document.querySelector(id)
        }

        hide () {
            this.$node.classList.add('hide')
        }

        show () {
            this.$node.classList.remove('hide')
        }

        toggleClass () {
            this.$node.classList.toggle('active')
        }
    }

    const $cartSubjectLeft = new Component('.cart-subject__item.left')
    const $cartSubjectRight = new Component('.cart-subject__item.right')
    const $cartMap = new Component('.cart-delivery-country-wrapper')
    const $delivery = new Component('.delivery')

    $cartSubjectLeft.$node.addEventListener('click', (e) => {
        e.preventDefault()
        $cartSubjectLeft.toggleClass()
        $cartSubjectRight.toggleClass()
    })

    $cartSubjectRight.$node.addEventListener('click', (e) => {
        e.preventDefault()
        $cartSubjectRight.toggleClass()
        $cartSubjectLeft.toggleClass()
    })

    const $deliveryChose = document.querySelectorAll('.cart-delivery-option-item')
    const $check = document.querySelectorAll('.checkbox')

    for (const check of $check) {
        check.addEventListener('change', (e) => {
            for (const node of $deliveryChose) {
                if (!node.classList.contains('active')) {
                    $deliveryChose.forEach((node) => {
                        node.classList.remove('active')
                    })
                }
            }
            $check.forEach((elem) => {
                elem.checked = false
            })
            check.checked = true
            if (check.checked) {
                check.parentElement.parentElement.classList.add('active')
            } else {
                check.parentElement.parentElement.classList.remove('active')
            }

            if ($delivery.$node.classList.contains('active')) {
                $cartMap.show()
            } else {
                $cartMap.hide()
            }
        })
    }
})
