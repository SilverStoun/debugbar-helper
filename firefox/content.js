var debugbar = (function() {
    // Создать строку в куки
    function setCookie(name, value, days)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + "; expires=" + exp.toGMTString() + "; path=/";
    }

    // Получить строку из куки
    function getCookie(name)
    {
        // Search for the start of the goven cookie
        var prefix = name + "=",
            cookieStartIndex = document.cookie.indexOf(prefix),
            cookieEndIndex;

        // If the cookie is not found return null
        if (cookieStartIndex == -1)
        {
            return null;
        }

        // Look for the end of the cookie
        cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
        if (cookieEndIndex == -1)
        {
            cookieEndIndex = document.cookie.length;
        }

        // Extract the cookie content
        return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
    }

    // Удалить строку из куки
    function deleteCookie(name)
    {
        setCookie(name, null, -1);
    }

    var exposed = {
        messageListener : function(request, sender, sendResponse)
        {
            var newStatus,
                key = "debugbar";

            // Выполнить запрошенную команду
            if (request.cmd == "getStatus")
            {
                newStatus = exposed.getStatus(key);
            }
            else if (request.cmd == "setStatus")
            {
                newStatus = exposed.setStatus(request.status, key);
            }

            // Отправляем в ответ новый статус
            sendResponse({ status: newStatus });
        },

        // Получить текущий статус
        getStatus : function(key)
        {
            var status = 0;

            // Если в куки есть ключ key, меняем статус на 1
            if (getCookie(key))
            {
                status = 1;
            }

            return status;
        },

        // Установить новый статус
        setStatus : function(status, key)
        {
            if (status == 1)
            {
                // Добавляем новую строку в куки (debugbar = 1)
                setCookie("debugbar", 1, 365);
            }
            else
            {
                // Удаляем строку с ключом "debugbar"
                deleteCookie("debugbar");
            }

            // Возвращаем новый статус
            return exposed.getStatus(key);
        }
    };

    return exposed;
})();

// Создаем слушателя на событие прихода сообщений
chrome.runtime.onMessage.addListener(debugbar.messageListener);
