<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" type="text/css" href="/static/css/styles.css">

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

        <!-- jQuery library -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <!-- Popper JS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

        <!-- Latest compiled JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <title>{{ title }}</title>
    </head>
    <body>
        <header id="header">
            <h1>Zapp Logs</h1>
        </header>
        <main id="content">
            {% if pin %}
                <h2>New PIN created: {{ pin }}</h2>
            {% endif %}

            <a href="/new_bucket" target="_self">
                <button type="button" class="btn btn-primary">New bucket</button>
            </a>

            {%  for entry in entries %}
            <div class="card" style="width: 36rem; margin: 16px">
              <div class="card-header d-flex justify-content-between">
                <b>{{ entry.pin }}</b>
                <div><b>Expires:</b> {{ entry.expires.strftime('%Y-%m-%d %H:%m') }}</div>
               </div>

              {% if entry.appInfo %}
                <div class="card-body d-flex justify-content-between">
                   <p>{{ entry.appInfo.appName }} {{ entry.appInfo.versionId }}</p>
                   {% if entry.has_events %}
                    <a href="download/{{entry.pin}}" target="_blank">
                      <button type="button" class="btn btn-primary">Download</button>
                    </a>
                  {% endif %}
                </div>
              {% endif %}

            </div>
            {% endfor %}
        </main>
        <footer id="footer">Applicaster (c) 2021</footer>
    </body>
</html>
