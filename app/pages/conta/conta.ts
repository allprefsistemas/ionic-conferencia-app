import {Page, NavController, Alert} from 'ionic-angular';
import {UsuarioDados} from '../../providers/usuario-dados';

@Page({
    templateUrl: 'build/pages/conta/conta.html',
})
export class ContaPagina {
    usuario:string;

    constructor(private nav:NavController, private usuarioDados:UsuarioDados) {
    }

    ngAfterViewInit() {
        this.pegaUsuario();
    }

    pegaUsuario() {
        this.usuarioDados.pegaUsuario().then((usuario) => {
            this.usuario = usuario;
        });
    }

    trocaFoto() {
        alert('Clicou para trocar Foto');
    }

    // Mostra um alerta com os dados do usuário
    // clicar em OK irá atualizar o usuário e mostrar.
    // clicar Cancelar irá fechar o alerta.
    mudarUsuario() {
        let alerta = Alert.create({
            title: 'Mudar Usuário',
            buttons: [
                'Cancelar'
            ]
        });
        alerta.addInput({
            name: 'usuario',
            value: this.usuario,
            placeholder: 'Usuário'
        });
        alerta.addButton({
            text: 'Ok',
            handler: data => {
                this.usuarioDados.defineUsuario(data.usuario);
                this.pegaUsuario();
            }
        });

        this.nav.present(alerta);
    }


    mudarSenha() {
        alert('Clicou em Mudar Senha');
    }

    sair() {
        this.usuarioDados.sair();
    }
}
