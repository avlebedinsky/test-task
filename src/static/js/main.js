/* eslint-disable no-undef */
'use strict'
document.addEventListener('DOMContentLoaded', function () {
    class Component {
        constructor (id) {
            this.$node = document.querySelector(id)
        }

        addClass (name) {
            const arr = this.$node.className.split(' ')
            if (arr.indexOf(name) === -1) {
                this.$node.className += ' ' + name
            }
            // this.$node.classList.add('hide')
        }

        removeClass (name) {
            const regexp = new RegExp('\\b' + name + '\\b', 'g')
            this.$node.className = this.$node.className.replace(regexp, '')
            // this.$node.classList.remove('hide')
        }

        toggleClass (name) {
            if (this.$node.classList) {
                this.$node.classList.toggle(name)
            } else {
            // For IE9
                const classes = this.$node.className.split(' ')
                const i = classes.indexOf(name)

                if (i >= 0) {
                    classes.splice(i, 1)
                } else {
                    classes.push(name)
                    this.$node.className = classes.join(' ')
                }
            }
        }

        getPrice () {
            return this.$node.getAttribute('data-price')
        }

        setPrice (value) {
            return this.$node.setAttribute('data-price', value)
        }
    }

    const $cartSubjectLeft = new Component('.cart-subject__item.left')
    const $cartSubjectRight = new Component('.cart-subject__item.right')

    const $cartMap = new Component('.cart-delivery-country-wrapper')
    const $feeStation = new Component('.subway')

    const $address = new Component('.js-address')
    const $orderDelivery = new Component('.js-order-delivery')
    const $mailError = new Component('.cart-contact-mail-error')
    // const $mail = new Component('.js-mail')

    const $deliveryPrice = new Component('.js-delivery-price')
    const $discount = new Component('.js-item-price-discount')
    const $total = new Component('.js-item-price-total')
    const $itemPrice = document.querySelectorAll('.js-item-price')
    const $totalSum = new Component('.total-sum')
    const $cartSum = new Component('.header-cart-sum')

    const $priceCourier = new Component('.js-price-courier')
    const $priceCompany = new Component('.js-price-company')
    const $pricePickup = new Component('.js-price-pickup')

    const $labelCourier = new Component('.js-delivery-courier')
    const $labelCompany = new Component('.js-delivery-company')
    const $labelPickup = new Component('.js-delivery-pickup')

    const $textArea = new Component('.cart-comment')
    const $userName = new Component('.cart-user-name input')
    const $userSurname = new Component('.cart-user-surname input')
    const $userMail = new Component('.cart-contact-mail input')
    const $userPhone = new Component('.cart-contact-number-phone input')
    const $city = new Component('.cart-delivery-country-city input')

    // TODO change node to e.target
    function isValid (node, validator, flag = 'g') {
        const re = new RegExp(validator, flag)
        const isValid = re.test(node.$node.value)
        if (!isValid) {
            node.addClass('invalid')
        } else {
            node.removeClass('invalid')
        }
        return isValid
    }

    $userName.$node.addEventListener('change', () => {
        isValid($userName, '^[а-яА-я-]+$')
    })

    $userSurname.$node.addEventListener('change', () => {
        isValid($userSurname, '^[а-яА-я-]+$')
    })

    $userMail.$node.addEventListener('change', () => {
        const valid = isValid($userMail, '(\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6})')
        if (!valid) {
            $mailError.removeClass('hide')
        } else {
            $mailError.addClass('hide')
        }
    })

    $userPhone.$node.addEventListener('change', () => {
        isValid($userPhone, '([0-9]{3}) ([0-9]{3}) ([0-9]{2})-([0-9]{2})')
    })

    $city.$node.addEventListener('change', () => {
        isValid($city, '^[а-яА-я-]+$')
    })

    $textArea.$node.addEventListener('change', (e) => {
        const regexp = /[^a-zA-Z0-9!.,?]+/g
        const valid = regexp.test(e.target.value)
        if (!valid) {
            $textArea.removeClass('invalid')
        } else {
            $textArea.addClass('invalid')
        }
    })

    ymaps.ready(initMap)

    function initMap () {
        const kuznetskiyMost = [55.7615072772162, 37.624516499999956]
        const vdnh = [55.82109777693579, 37.641036499999885]
        const kievskaya = [55.743588277269964, 37.565586499999945]
        const myMap = new ymaps.Map('map', {
            center: [55.7615072772162, 37.624516499999956],
            zoom: 13
        })
        const addPlacemark = (coordinates) => {
            myMap.geoObjects
                .add(new ymaps.Placemark(coordinates, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: '/static/img/mark.gif',
                    iconImageSize: [30, 42],
                    iconImageOffset: [-3, -42]
                }))
        }
        myMap.controls.remove('zoomControl')
        myMap.controls.remove('fullscreenControl')
        myMap.controls.remove('searchControl')
        myMap.controls.remove('typeSelector')
        myMap.controls.remove('trafficControl')
        myMap.controls.remove('geolocationControl')

        addPlacemark(kuznetskiyMost)
        addPlacemark(vdnh)
        addPlacemark(kievskaya)

        $feeStation.$node.addEventListener('change', () => {
            const value = $feeStation.$node.value
            switch (value) {
            case 'ВДНХ':
                myMap.panTo(vdnh, { delay: 6500 })
                $address.$node.innerText = 'пр-т Мира, 146, офис 55'
                break
            case 'Кузнецкий мост':
                myMap.panTo(kuznetskiyMost, { delay: 6500 })
                $address.$node.innerText = 'Ул. Кузнецкий мост, 9/10 стр.2, офис 204'
                break
            case 'Киевская':
                myMap.panTo(kievskaya, { delay: 7000 })
                $address.$node.innerText = 'ул. Киевская, 14 строение 1, офис 404'
                break
            default:
                myMap.panTo(kuznetskiyMost, { delay: 6500 })
                $address.$node.innerText = 'Ул. Кузнецкий мост, 9/10 стр.2, офис 204'
                break
            }
        })
    }

    let sumItem = 0
    for (let i = 0; i <= $itemPrice.length - 1; i++) {
        sumItem += +$itemPrice[i].getAttribute('data-price')
    }

    const discount = sumItem * 0.05
    const discountStr = (discount + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
    const sumDiscount = sumItem - discount
    const sumDiscountStr = (sumDiscount + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')

    $discount.$node.innerText = `${discountStr} ₽`
    $total.$node.innerText = `${sumDiscountStr} ₽`

    function totalSum () {
        const totalSum = sumDiscount + +$deliveryPrice.getPrice()
        const totalSumStr = (totalSum + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
        $totalSum.$node.innerText = `${totalSumStr} ₽`
        $cartSum.$node.innerText = `${totalSumStr} ₽`
    }

    totalSum()

    // TODO change this event

    $cartSubjectLeft.$node.addEventListener('click', (e) => {
        e.preventDefault()
        $cartSubjectLeft.addClass('active')
        $cartSubjectRight.removeClass('active')
    })

    $cartSubjectRight.$node.addEventListener('click', (e) => {
        e.preventDefault()
        $cartSubjectRight.addClass('active')
        $cartSubjectLeft.removeClass('active')
    })

    const radios = document.querySelectorAll('input[type="radio"]')
    const deliveryItems = document.querySelectorAll('.cart-delivery-option-item')

    for (let i = 0; i <= radios.length - 1; i++) {
        radios[i].addEventListener('change', (e) => {
            const id = e.target.id
            for (let i = 0; i <= deliveryItems.length - 1; i++) {
                deliveryItems[i].className = deliveryItems[i].className.replace(/\bactive\b/g, '')
            }
            if (id === 'delivery-courier') {
                $orderDelivery.$node.innerText = 'Доставка курьерской службой'
                $deliveryPrice.$node.innerText = `${$priceCourier.getPrice()} ₽`
                const price = $priceCourier.getPrice().toString()
                $deliveryPrice.setPrice(price)
                $labelCourier.addClass('active')
                $cartMap.addClass('hide')
            } if (id === 'delivery-company') {
                $orderDelivery.$node.innerText = 'Доставка транспортной компанией'
                $deliveryPrice.$node.innerText = `${$priceCompany.getPrice()} ₽`
                const price = $priceCompany.getPrice().toString()
                $deliveryPrice.setPrice(price)
                $labelCompany.addClass('active')
                $cartMap.addClass('hide')
            } if (id === 'delivery-pickup') {
                $orderDelivery.$node.innerText = 'Самовывоз'
                $deliveryPrice.$node.innerText = `${$pricePickup.getPrice()} ₽`
                const price = $pricePickup.getPrice().toString()
                $deliveryPrice.setPrice(price)
                $labelPickup.addClass('active')
                $cartMap.removeClass('hide')
            }
            totalSum()
        })
    }

    // TODO placeholder for IE9. fix

    const $placeHolder = document.querySelectorAll('input[placeholder]')

    for (let i = 0; i <= $placeHolder.length - 1; i++) {
        const node = $placeHolder[i]
        node.style.color = '#c4b7b1'
        if (node.value === '') {
            node.value = node.getAttribute('placeholder')
            node.addEventListener('focus', () => {
                if (node.value === node.getAttribute('placeholder')) {
                    node.value = ''
                }
            })
            node.addEventListener('blur', () => {
                if (node.value === '') {
                    node.value = node.getAttribute('placeholder')
                }
            })
        }
    }
})
