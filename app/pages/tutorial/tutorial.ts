import {Page, NavController, MenuController, Events} from 'ionic-angular';
import {UsuarioDados} from '../../providers/usuario-dados';
import {abasPagina} from '../abas/abas';
import {entrarPagina} from '../entrar/entrar';

interface Slide {
    titulo:string;
    descricao:string;
    imagem:string;
}

@Page({
    templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPagina {
    slides:Slide[];
    mostraPular = true;
    verificarConectado = false;

    constructor(
        private nav:NavController,
        private menu:MenuController,
        private eventos:Events,
        private usuario:UsuarioDados
    ) {
        this.slides = [
            {
                titulo: 'Bem Vindo ao <b>ICA</b>',
                descricao: 'O <b>Ionic Conferência App</b> é uma amostra prática do Ionic Framework em ação, e uma' +
                ' demonstração prática de uso apropriado do código.',
                imagem: 'img/ica-slidebox-img-1.png',
            },
            {
                titulo: 'O que é Ionic?',
                descricao: '<b>Ionic Framework</b> é uma SDK de Código Aberto que permite desenvolvedores a construirem' +
                ' aplicações para celulares de qualidade com tecnologias web como HTML, CSS, and JavaScript.',
                imagem: 'img/ica-slidebox-img-2.png',
            },
            {
                titulo: 'O que é Ionic Platform?',
                descricao: 'O <b>Ionic Platform</b> é uma plataforma nas núvens para gerenciamento e escala de aplicativos' +
                ' Ionic com serviços integrados como notificações \'push\', construções nativas, autenticação de usuários' +
                ' e atualizações em tempo real.',
                imagem: 'img/ica-slidebox-img-3.png',
            }
        ];
    }

    comecaApp() {
        if (this.verificarConectado) {
            // se já estiver conectado ele avisa o sistema para mostrar
            // o menu de conectado e muda para a agenda.
            this.eventos.publish('usuario:entrar');
            this.nav.push(abasPagina);
        } else {
            // senão ele leva o usuário para entrar
            this.nav.push(entrarPagina);
        }
    }

    quandoSliderIniciar(slider) {
        this.mostraPular = !slider.isEnd;
    }

    onPageDidEnter() {
        // o menu deve estar desabilitado na página do tutorial.
        this.menu.enable(false);
        // verifica se o usuário já esta conectado
        this.usuario.verificarConectado().then((conectado) => {
            this.verificarConectado = conectado;
        });
    }

    onPageWillLeave() {
        // habilita o menu quando sai do tutorial.
        this.menu.enable(true);
    }

}
