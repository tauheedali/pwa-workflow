import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

var Customer = Backbone.Model.extend({
    urlRoot: '/customer',
    scheme: {
        name: {type: 'text', validators: ['required']},
        email: {type: 'text', validator: ['required', 'email']},
        triedMealPrep: {type: 'radio', validator: ['required']}
    },
    defaults: {
        id: null,
        name: '',
        email: '',
        triedMealPrep: 'N',
    },
    initialize: function () {
        this.bind("error", function (model, error) {
            // We have received an error, log it, alert it or forget it :)
            alert(error);
        });
        return this;
    },
    validate: function () {
        return "is it broken?";
    }
});
var CustomerCollection = Backbone.Collection.extend({
    model: Customer
});
CustomerCollection = Backbone.Collection;
var FormView = Backbone.View.extend({
    el: '#lead-capture',
    model: Customer,
    //form_template: _.template('<input type="text" name="name" value="<%= name %>"/>'),//_.template(template),//
    form_template: _.template($('#lead').html()),
    initialize: function () {
        this.render();
    },
    render: function () {
        //console.log(this.form_template());
       // this.$el.html(this.form_template(this.attributes));
        this.$el.html(this.form_template({name:'tauheed'}));
    }
});

var me = new Customer({
    name: 'Tauheed Ali',
    email: 'tauheedali91@gmail.com'
});
//console.log(me);
console.log(JSON.stringify({
    name: 'Tauheed Ali',
    email: 'tauheedali91@gmail.com'
}));
var formView = new FormView(me);

//CustomerCollection.add(me);
