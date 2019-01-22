$(function() {
    // Запрос происходит когда кликнули по иконке расширения
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs)
    {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                cmd: "getStatus"
            },
            function(response)
            {
                // Подсветить текущее состояние
                $('a[data-status="' + response.status + '"]').addClass("active");
            }
        );
    });

    // Обработчик нажатия по кнопке
    $("a").on("click", function(eventObject) {
        var newStatus = $(this).data("status");

        chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs)
        {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    cmd: "setStatus",
                    status: newStatus
                }
            );

            window.close();
        });
    });

});
