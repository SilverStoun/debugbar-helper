$(function() {
    var ideKey = "debugbar";

    // Check if localStorage is available and get the ideKey out of it if any
    if (localStorage)
    {
        if (localStorage["debugbar"])
        {
            ideKey = localStorage["debugbar"];
        }
    }

    // Request the current state from the active tab
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs)
    {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                cmd: "getStatus",
                idekey: ideKey
            },
            function(response)
            {
                // Highlight the correct option
                $('a[data-status="' + response.status + '"]').addClass("active");
            }
        );
    });

    // Attach handler when user clicks on
    $("a").on("click", function(eventObject) {
        var newStatus = $(this).data("status");

        // Set the new state on the active tab
        chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs)
        {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    cmd: "setStatus",
                    status: newStatus,
                    idekey: ideKey
                },
                function(response)
                {
                    // Make the backgroundpage update the icon and close the popup
                    chrome.runtime.getBackgroundPage(function(backgroundPage) {
                        backgroundPage.updateIcon(response.status, tabs[0].id);
                        window.close();
                    });
                }
            );
        });
    });

});
