import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {UsuarioDados} from './usuario-dados';

@Injectable()
export class ConferenciaDados {
    dados:any;

    constructor(private http:Http, private usuario:UsuarioDados) {
    }

    carrega() {
        if (this.dados) {
            // dados já carregados
            return Promise.resolve(this.dados);
        }

        // dados ainda não carregados
        return new Promise(resolve => {
            // Nós estamos utilizando o Angular Http provider para requisitar os dados,
            // então com a resposta vamos mapear o JSON para um objeto JS.
            // Após iremos processar os dados e resolver como uma promessa os dados novos.
            this.http.get('dados/dados.json').subscribe(retorno => {
                // Pegamos os dados puros, geramos os dados da agenda e salvamos os dados
                // para referência futura.
                this.dados = this.processaDados(retorno.json());
                resolve(this.dados);
            });
        });
    }

    processaDados(dados) {
        // Somente javascript puro nos objetos e arrays
        // montando os dados ligando os palestrantes as sessões.
        dados.dias = [];
        dados.assuntos = [];
        // passa por cada dia da agenda.
        dados.agenda.forEach(dia => {
            if (dados.dias.indexOf(dia.data) < 0) {
                dados.dias.push(dia.data);
            }
            // passa por cada grupo do dia.
            dia.grupos.forEach(grupo => {
                // passa por cada sessão do grupo e processa a sessão.
                grupo.sessoes.forEach(sessao => {
                    this.processaSessao(dados, sessao);
                });
            });
        });

        return dados;
    }

    processaSessao(dado, sessao) {
        // passa por cada palestrantes e carrega os dados.
        // usa o id do palestrante como chave.
        sessao.palestrantes = [];
        if (sessao.palestrantesID) {
            sessao.palestrantesID.forEach(palestranteID => {
                let palestrante = dado.palestrantes.find(s => s.id === palestranteID);
                if (palestrante) {
                    sessao.palestrantes.push(palestrante);
                    palestrante.sessoes = palestrante.sessoes || [];
                    palestrante.sessoes.push(sessao);
                }
            });
        }
        if (sessao.assuntos) {
            sessao.assuntos.forEach(assunto => {
                if (dado.assuntos.indexOf(assunto) < 0) {
                    dado.assuntos.push(assunto);
                }
            });
        }
    }

    lisagemSessoes(buscaTexto = '', assuntosExcluidos = [], seguimento = 'todos') {
        return this.carrega().then(dados => {
            buscaTexto = buscaTexto.toLowerCase().replace(/,|\.|-/g, ' ');
            let buscaPalavras = buscaTexto.split(' ').filter(w => !!w.trim().length);
            let dias = [];
            dados.agenda.forEach(data => {
                data.mostraSessoes = 0;
                data.grupos.forEach(grupo => {
                    grupo.esconder = true;
                    grupo.sessoes.forEach(sessao => {
                        sessao.data = data.data;
                        // verifica se a sessão deve ou não ser mostrada.
                        this.filtraSessao(sessao, buscaPalavras, assuntosExcluidos, seguimento);
                        if (!sessao.esconder) {
                            // se a sessão não estiver escondida então mostra a mesma.
                            grupo.esconder = false;
                            data.mostraSessoes++;
                        }
                    });
                });
                dias.push(data);
            });
            return dias;
        });
    }

    filtraSessao(sessao, buscaPalavras, assuntosExcluidos, seguimento) {
        let buscaTextoCombina = false;
        if (buscaPalavras.length) {
            // verificamos o nome da sessão para cada palavra na busca
            buscaPalavras.forEach(palavra => {
                if (sessao.nome.toLowerCase().indexOf(palavra) > -1) {
                    buscaTextoCombina = true;
                }
            });
        } else {
            // se não encontrar nenhuma palavra da busca
            buscaTextoCombina = true;
        }
        // se nenhuma assunto estiver escondido
        let assuntoCombina = false;
        sessao.assuntos.forEach(assunto => {
            if (assuntosExcluidos.indexOf(assunto) === -1) {
                assuntoCombina = true;
            }
        });
        // se o seguimento for 'favoritos', mas a sessão não estiver como favorita
        // então a sessão não é passada.
        let seguimentoCombina = false;
        if (seguimento === 'favoritos') {
            if (this.usuario.temFavorito(sessao.id)) {
                seguimentoCombina = true;
            }
        } else {
            seguimentoCombina = true;
        }
        // todos os testes tem que ser válidos para a sessão não ser escondida.
        sessao.esconder = !(buscaTextoCombina && assuntoCombina && seguimentoCombina);
    }

    pegaPalestrantes() {
        return this.carrega().then(dados => {
            return dados.palestrantes.sort((a, b) => {
                let aNome = a.nome.split(' ').pop();
                let bNome = b.nome.split(' ').pop();
                return aNome.localeCompare(bNome);
            });
        });
    }

    pegaAssuntos() {
        return this.carrega().then(assuntos => {
            return assuntos.assuntos.sort();
        });
    }

    pegaMapa() {
        return this.carrega().then(dados => {
            return dados.mapa;
        });
    }

}
