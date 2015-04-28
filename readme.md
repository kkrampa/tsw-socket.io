# Zadanie 1.

Korzystając z zawartego w repozytorium „szkieletu” stwórz prosty komunikator internetowy.
Wszystkie zależności projektu zostały zdefiniowane w plikach konfiguracyjnych `package.json`
oraz `bower.json`.

  - Do zbudowania i obsługi interfejsu użytkownika wykorzystaj bibliotekę `jQuery`,
    <b>pozbywając się</b> jednocześnie zawartych w przykładzie odwołań do standardowego DOM API.
  - Styl opisujący wygląd interfejsu stwórz z pomocą języka `{less}`. Szkielet pliku
    źródłowego znajduje się w podkatalogu `less`. Zawiera on konfigurację dla wtyczki
    `brackets-less-autocompile` edytora Brackets, która powoduje, że po zapisaniu zmian,
    plik `{less}` jest kompilowany, minimalizowany i umieszczany w katalogu `public/css`.
  - Podczas łączenia się z serwerem komunikatora użytkownik powinien móc wybrać sobie
    nazwę/identyfikator, który musi być *unikatowy* w ramach zbioru wszystkich *aktywnych*
    w danym momencie użytkowników.
  - Wiadomości pomiędzy użytkownikami powinny być przesyłane za pomocą mechanizmów
    biblioteki `Socket.io`.
  - Podczas swojego działania, serwer powinien gromadzić całą historię wiadomości.
  - Interfejs komunikatora powinien udostępniać historię wiadomości (każda wiadomość powinna
    być opatrzona informacją o autorze oraz czasie utworzenia).
  - Po podłączeniu się z serwerem, użytkownikowi wyświetlany jest komunikat powitalny,
    a pozostali użytkownicy otrzymują informację o jego dołączeniu. 

## Jak uruchomić przykład

Będąc w katalogu głównym projektu wykonujemy instrukcje:

  - `npm install`
  - `bower install`
  - `node app.js`

Następnie, w przeglądarce otwieramy adres 
[http://localhost:3000/](http://localhost:3000/).

# Zadanie 2.

Do rozwiązania __Zadania 1__. dodaj obsługę „pokojów”, czyli nazwanych podgrup użytkowników.
Użytkownik może w dowolnej chwili dołączyć, do dowolnego istniejącego już pokoju,
a także utworzyć nowy. W implementacji pokojów wykorzystaj mechanizm „przestrzeni nazw”
(ang. name spaces) `Socket.io` (w szczególności przydać mogą się metody `socket.join`,
`socket.leave`, `socket.to`, `io.sockets.in`).

## Materiały i odsyłacze

  - [Repozytorium kodu i dokumentacja API Socket.io](https://github.com/Automattic/socket.io)
  - [Strona główna projektu Socket.io](http://socket.io/)