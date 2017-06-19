var crate
var openSound = new Audio('open-box.ogg');
openSound.volume = 0.1;
var results = [];
var isRunning = false;
var isOpen = false;

var path = "images/ungoro/";

$('.close').click(function(){
  $('.alert').remove();
});

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$('#crate').slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: false,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 3,
        centerMode: true
      }
    },
    {
      breakpoint: 769,
      settings: {
        slidesToShow: 2,
        centerMode: true
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        centerMode: true
      }
    }
    ]
});

$(document).ready(function(){

  $('.btn-toggle').click(function(){

    if(isOpen == true){
      $('#itemlog').css('display', 'none');
      $('.toggle').removeClass('fa-minus-circle');
      $('.toggle').addClass('fa-plus-circle');
      isOpen = false;
    }
    else{
      $('#itemlog').css('display', 'block');
      $('.toggle').removeClass('fa-plus-circle');
      $('.toggle').addClass('fa-minus-circle');
      isOpen = true;
    }

  })
});

function openBox(){

  if(isRunning == false){
    //Reset Crate
    results = [];
    setTimeout(delay,1750);
    setTimeout(hideBox,750);
    setTimeout(deleteCards,1050);
    openSound.play();
    $('#box').animateCss('bounceOutUp');
    $('#item0').animateCss('bounceOutUp');
    $('#item1').animateCss('bounceOutUp');
    $('#item2').animateCss('bounceOutUp');
    $('#item3').animateCss('bounceOutUp');
    $('#item4').animateCss('bounceOutUp');

    isRunning = true;
  }
}

function deleteCards(){
  $( "#item0" ).remove();
  $( "#item1" ).remove();
  $( "#item2" ).remove();
  $( "#item3" ).remove();
  $( "#item4" ).remove();
}

function hideBox(){
  $( "#box" ).remove();
}

function delay(){
  setTimeout(setBox,250);
}

function setBox(){

  for(i = 0; i < 4; i++){
    //Randomize Loot
    crate = chance.weighted(loot, weights);
    results.push(crate);
  }

  cratespec = chance.weighted(specloot, specweights);
  results.push(cratespec);

  endresults = chance.shuffle(results);
  displayBox();

}

function displayBox(){
  //Add to list
  for(i = 0; i < endresults.length; i++){

    //Create boxes
    var ul = document.getElementById("crate");

    $("#crate").slick('slickAdd', '<li class="animated bounceInDown" id="item' + i + '"><img src="' + path + endresults[i] + '-210x300.png" alt=""></li>');

    //Create inventory
    var inv = document.getElementById("itemlog");
    var invli = document.createElement("li");
    inv.setAttribute('class', 'in-use');
    invli.setAttribute("id", "inv" + i);
    inv.appendChild(invli);
    invli.appendChild(document.createTextNode(endresults[i]));

  }

  isRunning = false;
}

function shakeBox(){
  $("#box").addClass("shakebox");
  setTimeout(removeShake,820);
}

function removeShake(){
  $("#box").removeClass("shakebox");
  setTimeout(shakeBox,1820);
}