import {Page, NavController} from 'ionic-angular';
import {abasPagina} from '../abas/abas';
import {CadastrarPagina} from '../cadastrar/cadastrar';
import {UsuarioDados} from '../../providers/usuario-dados';

@Page({
    templateUrl: 'build/pages/entrar/entrar.html'
})
export class entrarPagina {
    entrar:{usuario?:string, senha?:string} = {};
    enviado = false;

    constructor(private nav:NavController, private usuarioDados:UsuarioDados) {
    }

    enviarForm(form) {
        this.enviado = true;

        if (form.valid) {
            this.usuarioDados.entrar(this.entrar.usuario);
            this.nav.push(abasPagina);
        }
    }

    fazerCadastro() {
        this.nav.push(CadastrarPagina);
    }

    entrarFacebook() {
        alert('Clicou Entrar com Facebook');
    }

    entrarGoogle() {
        alert('Clicou Entrar com Facebook');
    }

}
