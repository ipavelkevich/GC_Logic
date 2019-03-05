({
    afterRender : function( component, helper ) {
        this.superAfterRender();
        var didScroll = false;
        window.onscroll = function() {
            didScroll = true;
        };
        var idOfSetInterval = window.setInterval( $A.getCallback( function() {
            if ( didScroll && component.isValid() ) {
                didScroll = false;  
                if(document.getElementById('scroll') != null){
                    if ( window['scrollY'] >= document.getElementById('scroll')['scrollHeight'] - window['outerHeight'] - 100 ) {
                        helper.showMoreHelper(component);
                    }
                }
            }
        }), 500 );
    },
})