if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../../bb-sw.js', {scope: './'})
        .then(function (registration) {
            console.log('Service worker registered');
        })
        .catch(function (err) {
            console.log("Service Worker Failed", err);
        });

}
i
$('#lead-capture form').submit(function (e) {
    e.preventDefault();
    var formData = {};
    $.each($('#lead-capture form').serializeArray(), function () {
        formData[this.name] = this.value;
    });
    if (formData.subscribe) {
        //Save to local db
        formData.subscribe = 'Y';
    } else {
        formData.subscribe = 'N';
    }
    entryDB.open(function () {
        //Save to Local DB first
        entryDB.createLead(formData, function (lead) {
            console.log('[lead]');
            //Reset Form
            $.each($('#lead-capture input'), function () {
                $(this).val('');
            });
            $('#subscribe').attr('checked', true);
            $('#subscribe').parent()
                .find('label')
                .addClass('ui-checkbox-on')
                .removeClass('ui-checkbox-off');
            $('#used_meal_prep-a1').attr('checked', false);
            $('#used_meal_prep-b1').attr('checked', true);
            $('.ui-btn.ui-last-child').addClass('ui-btn-active ui-radio-on');
            $('.ui-btn.ui-last-child').removeClass('ui-radio-off');
            $('.ui-btn.ui-first-child').addClass('ui-radio-off');
            $('.ui-btn.ui-first-child').removeClass('ui-btn-active ui-radio-on');
        });
    });

});

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//Test