/* eslint-disable no-undef */
'use strict'
document.addEventListener('DOMContentLoaded', function () {
    ymaps.ready(init)

    function init () {
        const kuznetskiyMost = [55.7615072772162, 37.624516499999956]
        const vdnh = [55.82109777693579, 37.641036499999885]
        const kievskaya = [55.743588277269964, 37.565586499999945]
        const myMap = new ymaps.Map('map', {
            center: [55.7615072772162, 37.624516499999956],
            zoom: 13
        })
        const addPlacemark = (coordinates, iconColor) => {
            return (myMap.geoObjects
                .add(new ymaps.Placemark(coordinates, {
                    balloonContent: 'цвет <strong>воды пляжа бонди</strong>'
                }, {
                    preset: 'islands#icon',
                    iconColor: iconColor
                })))
        }

        addPlacemark(kuznetskiyMost, '#0095b6')
        addPlacemark(vdnh, '#0095b6')
        addPlacemark(kievskaya, '#0095b6')

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
    const $feeStation = new Component('.subway')
    const $address = new Component('.js-address')
    const $orderDelivery = new Component('.js-order-delivery')
    const $mailError = new Component('.cart-contact-mail-error')
    const $mail = new Component('.js-mail')
    const $deliveryPrice = new Component('.js-delivery-price')
    const $discount = new Component('.js-item-price-discount')
    const $total = new Component('.js-item-price-total')
    const $itemPrice = document.querySelectorAll('.js-item-price')
    const $totalSum = new Component('.total-sum')
    const $cartSum = new Component('.header-cart-sum')
    const $priceCourier = new Component('.js-price-courier')
    const $priceCompany = new Component('.js-price-company')
    const $pricePickup = new Component('.js-price-pickup')

    let sumItem = 0
    for (const node of $itemPrice) {
        sumItem += +node.dataset.price
    }
    const discount = sumItem * 0.05
    const discountStr = (discount + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
    const sumDiscount = sumItem - discount
    const sumDiscountStr = (sumDiscount + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
    $discount.$node.innerText = `${discountStr} ₽`
    $total.$node.innerText = `${sumDiscountStr} ₽`

    function totalSum () {
        const totalSum = sumDiscount + +$deliveryPrice.$node.dataset.price
        const totalSumStr = (totalSum + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
        $totalSum.$node.innerText = `${totalSumStr} ₽`
        $cartSum.$node.innerText = `${totalSumStr} ₽`
    }

    totalSum()

    $mail.$node.addEventListener('change', () => {
        // eslint-disable-next-line no-useless-escape
        const value = '(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})'
        if ($mail.$node.value !== value) {
            $mailError.show()
        } else {
            $mailError.hide()
        }
    })

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

            if (e.target.classList.contains('js-check-box-courier')) {
                $orderDelivery.$node.innerText = 'Доставка курьерской службой'
                $deliveryPrice.$node.innerText = `${$priceCourier.$node.dataset.price} ₽`
                $deliveryPrice.$node.dataset.price = $priceCourier.$node.dataset.price
            } if (e.target.classList.contains('js-check-box-company')) {
                $orderDelivery.$node.innerText = 'Доставка транспортной компанией'
                $deliveryPrice.$node.innerText = `${$priceCompany.$node.dataset.price} ₽`
                $deliveryPrice.$node.dataset.price = $priceCompany.$node.dataset.price
            } if (e.target.classList.contains('js-check-box-pickup')) {
                $orderDelivery.$node.innerText = 'Самовывоз'
                $deliveryPrice.$node.innerText = `${$pricePickup.$node.dataset.price} ₽`
                $deliveryPrice.$node.dataset.price = $pricePickup.$node.dataset.price
            }
            totalSum()
        })
    }
})
