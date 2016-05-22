import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';

@Injectable()
export class UsuarioDados {
    _favoritos = [];
    ESTA_CONECTADO = 'estaConectado';
    armazenagem = new Storage(LocalStorage);

    constructor(private eventos:Events) {
    }

    temFavorito(id) {
        return (this._favoritos.indexOf(id) > -1);
    }

    adicionaFavorito(id) {
        this._favoritos.push(id);
    }

    removeFavorito(id) {
        let indice = this._favoritos.indexOf(id);
        if (indice > -1) {
            this._favoritos.splice(indice, 1);
        }
    }

    verificarConectado() {
        return this.armazenagem.get(this.ESTA_CONECTADO).then((verifica) => {
            return verifica;
        });
    }

    entrar(usuario) {
        this.armazenagem.set(this.ESTA_CONECTADO, true);
        this.defineUsuario(usuario);
        this.eventos.publish('usuario:entrar');
    }

    cadastrar(usuario) {
        this.armazenagem.set(this.ESTA_CONECTADO, true);
        this.defineUsuario(usuario);
        this.eventos.publish('usuario:cadastrar');
    }

    sair() {
        this.armazenagem.remove(this.ESTA_CONECTADO);
        this.armazenagem.remove('usuario');
        this.eventos.publish('usuario:sair');
    }

    defineUsuario(usuario) {
        this.armazenagem.set('usuario', usuario);
    }

    pegaUsuario() {
        return this.armazenagem.get('usuario').then((valor) => {
            return valor;
        });
    }

    // retorna como promessa ('promise')
    estaConectado() {
        return this.armazenagem.get(this.ESTA_CONECTADO).then((valor) => {
            return valor;
        });
    }
}
