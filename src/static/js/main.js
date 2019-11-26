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

        addClass (name) {
            const arr = this.$node.className.split(' ')
            console.log(arr)
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
    }

    const $cartSubjectLeft = new Component('.cart-subject__item.left')
    const $cartSubjectRight = new Component('.cart-subject__item.right')
    const $cartMap = new Component('.cart-delivery-country-wrapper')
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

    const $labelCourier = new Component('.js-delivery-courier')
    const $labelCompany = new Component('.js-delivery-company')
    const $labelPickup = new Component('.js-delivery-pickup')

    const $textArea = new Component('.cart-comment')

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

    $mail.$node.addEventListener('change', () => {
        const re = new RegExp('\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}', 'g')
        const valid = re.test($mail.$node.value)
        console.log(valid)
        if (!valid) {
            $mailError.removeClass('hide')
        } else {
            $mailError.addClass('hide')
        }
    })

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
                deliveryItems[i].className = deliveryItems[i].className.replace(/\bmystyle\b/g, '')
            }
            if (id === 'delivery-courier') {
                $orderDelivery.$node.innerText = 'Доставка курьерской службой'
                $deliveryPrice.$node.innerText = `${$priceCourier.getPrice()} ₽`
                // $deliveryPrice.$node.dataset.price = $priceCourier.getPrice()
                $labelCourier.active()
                $cartMap.hide()
            } if (id === 'delivery-company') {
                $orderDelivery.$node.innerText = 'Доставка транспортной компанией'
                $deliveryPrice.$node.innerText = `${$priceCompany.getPrice()} ₽`
                // $deliveryPrice.$node.dataset.price = $priceCompany.getPrice()
                $labelCompany.active()
                $cartMap.hide()
            } if (id === 'delivery-pickup') {
                $orderDelivery.$node.innerText = 'Самовывоз'
                $deliveryPrice.$node.innerText = `${$pricePickup.getPrice()} ₽`
                // $deliveryPrice.$node.dataset.price = $pricePickup.getPrice()
                $labelPickup.active()
                $cartMap.show()
            }
            totalSum()
        })
    }

    $textArea.$node.addEventListener('change', (e) => {
        // eslint-disable-next-line no-useless-escape
        const regexp = /[^a-zA-Z0-9!.,?]+/g
        const valid = regexp.test(e.target.value)
        if (!valid) {
            $textArea.$node.classList.remove('invalid')
        } else {
            $textArea.$node.classList.add('invalid')
        }
    })

    // TODO placeholder for IE9

// $("input[placeholder]").each(function () {
//         var $this = $(this);
//         if($this.val() == ""){
//             $this.val($this.attr("placeholder")).focus(function(){
//                 if($this.val() == $this.attr("placeholder")) {
//                     $this.val("");
//                 }
//             }).blur(function(){
//                 if($this.val() == "") {
//                     $this.val($this.attr("placeholder"));
//                 }
//             });
//         }
//     });
})
