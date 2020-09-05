var url = location.origin + '/api/';

if (location.search) {

    var token = location.search;
    $('nav').hide()
    $('main').hide();
    $('.modal-dialog').addClass('modal-lg');
    $('.modal-content').load('partial/consulta-externa.html');
    $('.modal').modal('show');

} else {

    if (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== 'undefined') {
        var token = sessionStorage.getItem('token');
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jwt = JSON.parse(window.atob(base64));
        var user = JSON.parse(jwt.data);
        var permissions = user.permissao.split(',');
        var menu = $.ajax({
            url: 'json/menu.json',
            success: function(menu) {
                var liMenu = '';
                $.each(menu.items, function(i, item) {
                    if (item.subitems) {
                        var liSubMenu = '';
                        $.each(item.subitems, function(i, subitem) {
                            if (permissions.indexOf(subitem.id) > -1 && subitem.visible == null) {
                                liSubMenu += '<li id="' + subitem.id + '"><a class="dropdown-item" href="#' + subitem.id + '">' + subitem.label + '</a></li>';
                            }
                        });
                        if (liSubMenu) liMenu += '<li class="nav-item dropdown hvr-grow"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + item.label + '</a><ul class="dropdown-menu">' + liSubMenu + '</ul></li>';
                    } else {
                        if (permissions.indexOf(item.id) > -1) {
                            liMenu += '<li class="nav-item" id="' + item.id + '"><a class="nav-link" href="#' + item.id + '">' + item.label + '</a></li>';
                        }
                    }
                });

                $('title').html(menu.title);
                $('#menu').html(liMenu);
                $('#user').html('<li class="nav-item dropdown hvr-grow"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Olá ' + user.nome + '</a><ul class="dropdown-menu"><li id="mudasenha"><a class="dropdown-item" href="#mudasenha">Mudar senha</a></li><li id="out"><a class="dropdown-item" href="#out">Sair</a></li></ul></li>');

                return menu;
            }
        });

        var loop;
        var userCaseId;
        var out = function() {
            sessionStorage.removeItem('token');
            window.location.reload();
        }

        $('.navbar-nav').on('click', 'li', function() {
            clearInterval(loop);

            $('.navbar-nav li').removeClass("active");
            $(this).addClass("active");

            userCaseId = $(this).attr('id');
            if (typeof userCaseId !== 'undefined') {
                if (jwt.exp * 1000 > $.now()) {
                    if (userCaseId !== 'out') {
                        if (user.mudasenha == "1") userCaseId = 'mudasenha';
                        $('main').load('partial/' + userCaseId + '.html');
                    } else out();
                } else out();
            }
            $('.navbar-collapse').collapse('hide');
        });

        $.fn.dataTable.ext.errMode = function(settings, helpPage, message) {
            var error = message.split(" - ", 2);
            console.log(error[1]);
            if (error[1] == 'Token expirado') out();
        }

        $('main').load('partial/dashboard.html');
        $('.modal-dialog').addClass('modal-lg');

    } else {

        // Token não existe na sessionStorage
        $('nav').hide()
        $('main').hide();
        $('title').text('Disque Denuncia - Acesso restrito');
        $('.modal-dialog').addClass('modal-sm modal-dialog-centered');
        $('.modal-content').load('partial/login.html');
        $('.modal').modal('show');

    }
}