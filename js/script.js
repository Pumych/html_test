$(document).ready(function(){

});

function Animal(name){
    this.name = name;
    this.canWalk = true;
}

var animal = new Animal('Cow');

function Rabbit(name){
    this.name = name;
}

Rabbit.prototype = animal;

var r1= new Rabbit('kroll');








var Person = Class.extend({
    init: function(isDancing){
        this.dancing = isDancing;
    },
    dance: function(){
        return this.dancing;
    }
});

var Ninja = Person.extend({
    init: function(){
        this._super( false );
    },
    dance: function(){
        this._super();
    }
});

console.log(Ninja.dance());
