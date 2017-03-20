var crate
var openSound = new Audio('open-box.ogg');
var results = [];
var isRunning = false;

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
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

    isRunning = true;
  }
}

function deleteCards(){
  $( "#item0" ).remove();
  $( "#item1" ).remove();
  $( "#item2" ).remove();
  $( "#item3" ).remove();
}

function hideBox(){
  $( "#box" ).remove();
}

function delay(){
  setTimeout(setBox,250);

}

function setBox(){


  for(i = 0; i < 3; i++){
    //Randomize Loot
    crate = chance.weighted(loot, weights);
    results.push(crate);
    console.log(crate);
  }

  cratespec = chance.weighted(specloot, specweights);
  results.push(cratespec);

  endresults = chance.shuffle(results);
  displayBox();

}

function displayBox(){
  //Add to list
  for(i = 0; i < endresults.length; i++){
    var ul = document.getElementById("crate");
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(endresults[i]));
    li.setAttribute("id", "item" + i);
    ul.appendChild(li);
    li.appendChild(span);

    //Check Quality and Strip
    var str = $("#item" + i).text();
    console.log(str);
     if(endresults[i].indexOf("Normal") !=-1){
      $("#item" + i).addClass("normal animated bounceInDown");
      $("#item" + i ).find('span').text(str.substring(7));
    }
    if (endresults[i].indexOf("Rare") !=-1){
      $("#item" + i).addClass("rare animated bounceInDown");
      $("#item" + i).find('span').text(str.substring(5));
    }
    if(endresults[i].indexOf("Epic") !=-1){
      $("#item" + i).addClass("epic animated bounceInDown");
      $("#item" + i).find('span').text(str.substring(5));
    }
    if(endresults[i].indexOf("Lgnd") !=-1){
      $("#item" + i).addClass("legendary animated bounceInDown");
      $("#item" + i).find('span').text(str.substring(5));
    }

    //Check Hero
    //Generic
    if(endresults[i].indexOf("Spray") || endresults[i].indexOf("Coins") !=-1){
      $("#item" + i).addClass("generic");
    }
    //orisa
    if(endresults[i].indexOf("Orisa") !=-1){
      $("#item" + i).addClass("orisa");
    }
    
    //sombra
    if(endresults[i].indexOf("Sombra") !=-1){
      $("#item" + i).addClass("sombra");
    }
    //ana
    if(endresults[i].indexOf("Ana") !=-1){
      $("#item" + i).addClass("ana");
    }
    //bastion
    if(endresults[i].indexOf("Bastion") !=-1){
      $("#item" + i).addClass("bastion");
    }
    //dva
    if(endresults[i].indexOf("D.Va") !=-1){
      $("#item" + i).addClass("dva");
    }
    //genji
    if(endresults[i].indexOf("Genji") !=-1){
      $("#item" + i).addClass("genji");
    }
    //hanzo
    if(endresults[i].indexOf("Hanzo") !=-1){
      $("#item" + i).addClass("hanzo");
    }
    //junkrat
    if(endresults[i].indexOf("Junkrat") !=-1){
      $("#item" + i).addClass("junkrat");
    }
    //lucio
    if(endresults[i].indexOf("Lucio") !=-1){
      $("#item" + i).addClass("lucio");
    }
    //McCree
    if(endresults[i].indexOf("McCree") !=-1){
      $("#item" + i).addClass("mccree");
    }
    //Reaper
    if(endresults[i].indexOf("Reaper") !=-1){
      $("#item" + i).addClass("reaper");
    }
    //Mei
    if(endresults[i].indexOf("Mei") !=-1){
      $("#item" + i).addClass("mei");
    }
    //Mercy
    if(endresults[i].indexOf("Mercy") !=-1){
      $("#item" + i).addClass("mercy");
    }
    //Pharah
    if(endresults[i].indexOf("Pharah") !=-1){
      $("#item" + i).addClass("pharah");
    }
    //Reinhardt
    if(endresults[i].indexOf("Reinhardt") !=-1){
      $("#item" + i).addClass("reinhardt");
    }
    //Roadhog
    if(endresults[i].indexOf("Roadhog") !=-1){
      $("#item" + i).addClass("roadhog");
    }
    //Solider76
    if(endresults[i].indexOf("Soldier: 76") !=-1){
      $("#item" + i).addClass("soldier");
    }
    //Symmetra
    if(endresults[i].indexOf("Symmetra") !=-1){
      $("#item" + i).addClass("symmetra");
    }
    //Torbjorn
    if(endresults[i].indexOf("Torbjorn") !=-1){
      $("#item" + i).addClass("torbjorn");
    }
    //Tracer
    if(endresults[i].indexOf("Tracer") !=-1){
      $("#item" + i).addClass("tracer");
    }
    //Widowmaker
    if(endresults[i].indexOf("Widowmaker") !=-1){
      $("#item" + i).addClass("widowmaker");
    }
    //Winston
    if(endresults[i].indexOf("Winston") !=-1){
      $("#item" + i).addClass("winston");
    }
    //Zarya
    if(endresults[i].indexOf("Zarya") !=-1){
      $("#item" + i).addClass("zarya");
    }
    //Zenyatta
    if(endresults[i].indexOf("Zenyatta") !=-1){
      $("#item" + i).addClass("zenyatta");
    }

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