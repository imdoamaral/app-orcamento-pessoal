/*
Classes
*/

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) { //'this' aqui faz referencia ao proprio objeto

            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                //this[i] acessa o valor dos atributos do objeto
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id') //recupera o id

        if(id === null) {
            localStorage.setItem('id', 0) //inicia um valor pra id quando essa informacao na existir no local storage
        }
    }

    gravar(despesa) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(despesa)) //converte o objeto id para notacao JSON

        localStorage.setItem('id', id) //atualiza o 'id' com id recuperado
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id') //recupera o id
        return parseInt(proximoId) + 1 //atualiza o valor contido no indice
    }

    recuperarTodosRegistros() {

        //array despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recupera todas as despesas cadastradas em local storage
        for(let i=1; i <= id; i++) {
            
            //recuperar a despesa e a converte para um objeto literal
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possiblidade de haver indices que fora pulados/removidos
            //nestes casos nos vamos pular esse indices
            if(despesa === null) {
                continue //pula para a proxima iteracao do laco
            }
            
            despesa.id = i //add um novo atributo (em tempo de execucao) ao obj despesa
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {

        let despesasFiltradas = Array()
        
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas //devolve o array despesasFiltradas pra quem faz a chamada do metodo
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

/*
Functions
*/

function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, //o atributo .value acessa o VALOR da variavel
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()) {

        bd.gravar(despesa)

        //manipulacao dos elementos do DOM no modalRegistroDespesa
        document.getElementById('modal-titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal-titulo-div').className = 'modal-header text-success'
        document.getElementById('modal-conteudo').innerHTML = 'Despesa cadastrada!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        //limpando os campos de registro de nova despesa
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {

        //manipulacao dos elementos do DOM no modalRegistroDespesa
        document.getElementById('modal-titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal-titulo-div').className = 'modal-header text-danger'
        document.getElementById('modal-conteudo').innerHTML = 'Verifique se todos os campos foram preenchidos corretamente.'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalRegistraDespesa').modal('show') //seleciona a div que contem o modal e exibe para o usuario
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros() //executa quando o valor recebido como parametro 'nao for um array' 
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('lista_despesas')
    listaDespesas.innerHTML = ''  


    /*
    <tr>
        0 = <td>19/07/2020</td>
        1 = <td>Alimentação</td>
        2 = <td>Compras do mes</td>
        3 = <td>444.75</td>
    </tr>
    */

    //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d) { 
        
        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        //ajustar o tipo
        switch(d.tipo) { //ATENCAO: d.tipo aqui eh uma String, nao um numeral
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //botao de exclusao
        let btn = document.createElement('button')

        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`//HOLY SHIT THAT WAS COMPLEX

        btn.onclick = function() {
            //formatar a string eliminando os caracteres 'id_despesa_' e deixando apenas o numero
            let id = this.id.replace('id_despesa_', '')            
            
            //remover a despesa
            bd.remover(id)

            //atualiza a pagina
            window.location.reload()
        }

        linha.insertCell(4).append(btn)

    })
}

function pesquisarDespesa() {
    //coleta os valores contidos nos campos do formulario (de consulta)
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}