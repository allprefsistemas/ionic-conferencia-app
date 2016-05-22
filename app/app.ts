import {ViewChild} from '@angular/core';
import {App, Events, Platform, Nav, MenuController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {ConferenciaDados} from './providers/conferencia-dados';
import {UsuarioDados} from './providers/usuario-dados';
import {ContaPagina} from './pages/conta/conta';
import {abasPagina} from './pages/abas/abas';
import {entrarPagina} from './pages/entrar/entrar';
import {CadastrarPagina} from './pages/cadastrar/cadastrar';
import {TutorialPagina} from './pages/tutorial/tutorial';

interface PaginaObj {
    titulo:string;
    componente:any;
    icone:string;
    indice?:number;
}

@App({
    templateUrl: 'build/app.html',
    providers: [ConferenciaDados, UsuarioDados],
    // Defina qualquer configuração do aplicativo aqui,veja outras
    // formas de configurar seu aplicativo aqui:
    // http://ionicframework.com/docs/v2/api/config/Config/
    config: {
        // Coloca as abas na parte inferior para todas as plataformas
        // Veja a documentação sobre Temas para os valores padrão:
        // http://ionicframework.com/docs/v2/theming/platform-specific-styles/
        tabbarPlacement: 'bottom',
        // não mostra texto no botão voltar
        backButtonText: ''
    },
    // Coloca em modo de produção
    prodMode: true
})
class ConferenciaApp {
    // A raiz da navegação é filha do componente raiz do aplicativo
    // @ViewChild(Nav) pega a referência para a raiz da nevagação do aplicativo
    @ViewChild(Nav) nav:Nav;

    // Lista as páginas que podem ser acessadas pelo menu da esquerda
    // O menu somente irá funcionar após o usuário entrar
    appPaginas:PaginaObj[] = [
        {titulo: 'Agenda', componente: abasPagina, icone: 'calendar'},
        {titulo: 'Palestrantes', componente: abasPagina, indice: 1, icone: 'contacts'},
        {titulo: 'Mapa', componente: abasPagina, indice: 2, icone: 'map'},
        {titulo: 'Sobre', componente: abasPagina, indice: 3, icone: 'information-circle'},
    ];
    conectadoPaginas:PaginaObj[] = [
        {titulo: 'Conta', componente: ContaPagina, icone: 'person'},
        {titulo: 'Sair', componente: abasPagina, icone: 'log-out'}
    ];
    desconectadoPaginas:PaginaObj[] = [
        {titulo: 'Entrar', componente: entrarPagina, icone: 'log-in'},
        {titulo: 'Cadastrar', componente: CadastrarPagina, icone: 'person-add'}
    ];
    
    rootPage:any = TutorialPagina;

    constructor(private eventos:Events,
                private usuarioDados:UsuarioDados,
                private menu:MenuController,
                plataforma:Platform,
                conferenciaDados:ConferenciaDados) {
        // Chama os plugins quando a Plataforma estiver Pronta
        plataforma.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });

        // Carrega os Dados da Conferência
        conferenciaDados.carrega();

        // Decide quais itens do menu devem ser escondidos pelo status do usuário guardado no Local Storage.
        this.usuarioDados.estaConectado().then((estaConectado) => {
            this.habilitarMenu(estaConectado === 'true');
        });

        this.escutarEventosConexao();
    }

    abrePagina(pagina:PaginaObj) {
        // O componente de navegação pode ser encontrado utilizando @ViewChild(Nav)
        // Reinicia o navegador para remover as páginas anteriores e ter somente esta página
        // Nós não queremos o botão Voltar aparecendo neste cenário.
        if (pagina.indice) {
            this.nav.setRoot(pagina.componente, {abaIndice: pagina.indice});

        } else {
            this.nav.setRoot(pagina.componente);
        }

        if (pagina.titulo === 'Sair') {
            // Dá ao menu tempo de fechar antes de mudar para Desconectado.
            setTimeout(() => {
                this.usuarioDados.sair();
            }, 1000);
        }
    }

    escutarEventosConexao() {
        this.eventos.subscribe('usuario:entrar', () => {
            this.habilitarMenu(true);
        });

        this.eventos.subscribe('usuario:cadastrar', () => {
            this.habilitarMenu(true);
        });

        this.eventos.subscribe('usuario:sair', () => {
            this.habilitarMenu(false);
            this.nav.setRoot(entrarPagina);
        });
    }

    habilitarMenu(conectado) {
        this.menu.enable(conectado, 'menuConectado');
        this.menu.enable(!conectado, 'menuDesconectado');
    }
}
