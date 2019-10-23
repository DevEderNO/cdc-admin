import React, { Component } from 'react';
import $ from 'jquery';
import ImputCustumizado from './componentes/inputCostumizado';
import SubmitCostumizado from './componentes/submitCostumizado';
import PubSub from 'pubsub-js';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { lista: [], nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }

    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }

    setSenha(evento) {
        this.setState({ senha: evento.target.value });
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            contentType: 'json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (novaListagem) {
                PubSub.publish('atualiza-lista-autores',novaListagem);
            },
            error: function (resposta) {
                console.log("erro");
            }
        });
        console.log("dados sendo enviados");
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">

                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <ImputCustumizado id="nome"
                        type="text"
                        name="nome"
                        value={this.state.nome}
                        onChange={this.setNome}
                        label="Nome" />
                    <ImputCustumizado id="email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.setEmail}
                        label="Email" />
                    <ImputCustumizado id="senha"
                        type="password"
                        name="senha"
                        value={this.state.senha}
                        onChange={this.setSenha}
                        label="Senha" />
                    <SubmitCostumizado texto="Gravar" />
                </form>
            </div>
        );
    }
}

class TabelaAutor extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(function (autor) {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
        this.atualizaListagem = this.atualizaListagem.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        })

        PubSub.subscribe('atualiza-lista-autores',function(topico,novaListagem){
            this.setState({lista:novaListagem});
        }.bind(this));
    }

    atualizaListagem(novaListagem){
        this.setState({lista:novaListagem});
    }

    render() {
        return (
            <div>
                <FormularioAutor/>
                <TabelaAutor lista={this.state.lista}/>
            </div>
        );
    }
}