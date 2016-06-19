(function( factory ){
	factory( jQuery );
}(function( $ ){
	$.extend($.fn, {
		/**
		* 校验器工厂
		*/
		validate: function( options ){
			//这里this是$form对象
			validator = new $.validator(options, this[0]);

			//将校验器对象绑定到$form上
			$.data( this[0], "validator", validator );

			return validator;
		},
		validateDelegate: function(delegate, type, handler){
			return this.on(type, function(event){
				var $target = $(event.target);

				if($target.is(delegate)){
					return handler.apply($target, arguments);
				}
			});
		}
	});
}));

/**
校验器构造函数
*/
$.validator = function(options, form){
	//settings用来保存触发的事件以及其他属性
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.extend($.validator, {
	defaults: {
		onchange: function( element ){
			console.log( element );
		},
		onclick: function( element ){
			console.log( element );
		}
	},
	prototype: {
		init: function(){
			//补充属性
			this.submitted = {};
			this.valueCache = {};

			//定义委托回调事件
			function delegate( event ) {
				//去除绑定的校验器对象
				var validator = $.data( this[0].form, "validator" ),
					eventType = "on" + event.type,
					settings = validator.settings;

				settings[ eventType ].call( validator, this[0], event );

			}

			//绑定事件
			$( this.currentForm )
				.validateDelegate("[type='text'], [type='email']", "change", delegate)
				.validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", delegate);

		}
	}
});
