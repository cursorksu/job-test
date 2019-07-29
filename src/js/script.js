"use strict";

$('.select__city').niceSelect();
$(function () {
    $('.slider').slick({
        centerMode: true,
        centerPadding: '160px',
        infinite: true,
        speed: 500,
        cssEase: 'ease-out',
        useTransform: true,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });



    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const form = {
        isError: false,
        isSubmit: false,
        winnArray: [],
        winnCount: 0,
        selectedNumbers: [],

        validation: function(form) {
             if(form.is('.form__block--error') || form.siblings('.form__block--error').length){
               this.isError = true;
               $('.form__button').attr('disabled', 'disabled');
               $('.form__error').addClass('form__error--active');
             }else {
                this.isError = false;
                $('.form__button').attr('disabled', false);
                $('.form__error').removeClass('form__error--active');
             }
        },

        foundSelectedNumbers: function(){
            $('.form__block').each(function () {
                let selectedArray = [];
                    $(this).children('.form__item').each(function () {
                        let selectedValue;
                        if($(this).children('input')[0].checked){
                            selectedValue = $(this).children('input').attr('value');
                            selectedArray.push(selectedValue);
                        }
                    });
                form.selectedNumbers.push(selectedArray);
            })
        },

        reset: function() {
            this.isError = false;
            this.isSubmit = false;
            this.winnArray = [];
            this.winnCount = 0;
            this.selectedNumbers = [];

            $('#form').removeClass('form--submit');
            $('#form')[0].reset();
            $('.form__item--highlight').removeClass('form__item--highlight');
            $('.form__item input').attr('disabled', false);
        }
    };

    function  hilightWinnNumbers(arr) {
        $('.form__block').each(function () {
            let i = $(this).index();
            $(this).children('.form__item').each(function () {
                const inputValue = + $(this).children('input').attr('value');
                if(arr[i].includes(inputValue)){
                    $(this).addClass('form__item--highlight');
                }
            });
        });
    }

    function  countWinn(arrRandom, arrSelected) {
        arrRandom.forEach(function(item, i, arr) {
            arrSelected[i].forEach(function(itemSelect, i, arr){
               if(item.includes(Number(itemSelect))){
                   return form.winnCount += 1;
               };
            });
        });
    }

    function setWinnNumbers(arr) {
        do {
            let newArray = [];
            do{
                let newElement = getRandomInt (1,21);
                if (!newArray.includes(newElement)) {
                    newArray.push(newElement);
                }
            } while (newArray.length < 5);
            arr.push(newArray);
        } while (form.winnArray.length < 5);
    }

    function winnTemplate(arr, winnCount ){
        $('.modal').addClass('active');
        $('.modal__winn-num').each(function () {
            let i = $(this).index();
            $(this).children('span').text(arr[i])
        })
        $('.modal__count').text (`${winnCount}`);
    }

    function setError(form) {
        form.addClass('form__block--error');
    }

    function removeError(form) {
        form.removeClass('form__block--error');
    }


$('.main-nav').on('click', function (e) {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;
        $('.main-nav__link--active').removeClass('main-nav__link--active')
        target.classList.add('main-nav__link--active');
    })


//клик вне тела модалки
    $('.modal').mouseup(function (e){ // отслеживаем событие клика по modal
        var block = $('.modal.active .modal__wrapper'); // определяем элемент, к которому будем применять условия (можем указывать ID, класс либо любой другой идентификатор элемента)
        if (!block.is(e.target) // проверка условия если клик был не по нашему блоку
            && block.has(e.target).length === 0) { // проверка условия если клик не по его дочерним элементам
            $('.modal').removeClass('active');
        }
    });

    $(document).keydown(function(e){
        if (e.which == 27){
            if($('.modal.active').length){
                $('.modal').removeClass('active');
            }
        }
    });


    $( ".form__block" ).change(function() {
        let checkedPoint = 0;
        $(this).children('.form__item').each(function () {
            if($(this).children('input')[0].checked){
                checkedPoint += 1;
            }
        })
        if(checkedPoint > 5){
            setError($(this));
        }else{
            removeError($(this));
        }

        form.validation($(this));
    });

    $('.js-modal-close').on('click', function (e) {
        $('.modal').removeClass('active');
    });

    $('.js-again').on('click', function (e) {
        form.reset();
    });

    $('form').submit(function() {
        event.preventDefault();
        $(this).addClass('form--submit');
        if(form.winnArray.length <= 0){
            setWinnNumbers(form.winnArray);
        }
        form.foundSelectedNumbers();

        hilightWinnNumbers(form.winnArray);

        countWinn(form.winnArray, form.selectedNumbers);

        if(!form.isError) {
            winnTemplate(form.winnArray, form.winnCount);
        }
        $('.form__item input').attr('disabled', 'disabled');


    });
});



