import {ViewChild} from '@angular/core';
import {IonicApp, Page, Modal, Alert, NavController, ItemSliding, List} from 'ionic-angular';
import {ConferenciaDados} from '../../providers/conferencia-dados';
import {UsuarioDados} from '../../providers/usuario-dados';
import {AgendaFiltroPagina} from '../agenda-filtro/agenda-filtro';
import {SessaoDetalhePagina} from '../sessao-detalhe/sessao-detalhe';

@Page({
    templateUrl: 'build/pages/agenda/agenda.html'
})
export class agendaPagina {
    // A lista é uma filha da agendaPagina
    // @ViewChild('agendaLista') pega a referência da lista
    // com a variável #agendaLista 'read: List', usamos para
    // retornar a lista, e não a referência do elemento.
    @ViewChild('agendaLista', {read: List}) agendaLista:List;

    buscaTexto = '';
    seguimento = 'todos';
    assuntosExcluidos = [];
    lisatagemDias = [];
    mostraDias = false;

    constructor(private app:IonicApp,
                private nav:NavController,
                private conferenciaDados:ConferenciaDados,
                private usuario:UsuarioDados) {
    }

    onPageDidEnter() {
        this.app.setTitle('Agenda');
    }

    ngAfterViewInit() {
        this.atualizaAgenda();
    }

    atualizaAgenda() {
        // fecha todos os sliding quando a agenda atualiza
        this.agendaLista && this.agendaLista.closeSlidingItems();

        this.conferenciaDados.lisagemSessoes(this.buscaTexto, this.assuntosExcluidos, this.seguimento).then(dados => {
            this.lisatagemDias = [];
            this.mostraDias = false;
            dados.forEach(diasVer => {
                if (diasVer.mostraSessoes > 0 && this.mostraDias === false) {
                    this.mostraDias = true;
                }
                this.lisatagemDias.push(diasVer);
            });
        });
    }

    filtroAtual() {
        let janela = Modal.create(AgendaFiltroPagina, this.assuntosExcluidos);
        this.nav.present(janela);

        janela.onDismiss((dados:any[]) => {
            if (dados) {
                this.assuntosExcluidos = dados;
                this.atualizaAgenda();
            }
        });

    }

    vaParaDetalhesDaSessao(sessaoDados) {
        // vai para a página com detalhes da sessão
        // e passa os dados da sessão clicada.
        this.nav.push(SessaoDetalhePagina, sessaoDados);
    }

    verFavorito(id) {
        if (this.usuario.temFavorito(id)) {
            return true;
        }
    }

    adicionaFavorito(slidingItem:ItemSliding, id) {
        if (this.verFavorito(id)) {
            // ops, já está adicionado aos favoridos! o que faremos?
            // perguntamos se quer remover.
            this.removeFavorito(slidingItem, id, 'Favorito já adicionado');
        } else {
            // lembra essa sessão como favorita do usuário.
            this.usuario.adicionaFavorito(id);

            // cria uma instância de alerta.
            let alerta = Alert.create({
                title: 'Adicionado aos Favoritos',
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        // close the sliding item
                        slidingItem.close();
                    }
                }]
            });
            // agora mostra ela na tela acima de todos os outros elementos.
            this.nav.present(alerta);
        }

    }

    removeFavorito(slidingItem:ItemSliding, id, titulo) {
        let alerta = Alert.create({
            title: titulo,
            message: 'Gostaria de remover esta sessão dos favoritos?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        // foi clicado o botão cancelar, então não remove a sessão,
                        // somente fecha as opções.
                        slidingItem.close();
                    }
                },
                {
                    text: 'Remover',
                    handler: () => {
                        // vamos remover essa sessão dos favoritos.
                        this.usuario.removeFavorito(id);
                        this.atualizaAgenda();

                        // e fechar as opções.
                        slidingItem.close();
                    }
                }
            ]
        });
        // agora mostra o alerta na tela, acima de todos os outros elementos.
        this.nav.present(alerta);
    }

    formataData(data, formato) {
        let partes = data.split("-");
        if (formato == 'curto') {
            return partes[2] + '/' + partes[1];
        } else {
            return partes[2] + '/' + partes[1] + '/' + partes[0];
        }
    }
}
