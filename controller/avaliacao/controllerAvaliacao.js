const message = require('../../modulo/config.js')
const avaliacaoDAO = require('../../model/DAO/avaliacao.js')
const controllerFilme = require('../filme/controllerFilme.js')
const controllerUsuario = require('../usuario/controllerUsuario.js')

const inserirAvaliacao = async function(avaliacao, contentType) {
    try {
        if(String(contentType).toLowerCase() == 'application/json') {
            if(avaliacao.nota == ''         || avaliacao.nota == undefined          || avaliacao.nota == null               || avaliacao.nota.length > 5    ||
               avaliacao.comentario==''     || avaliacao.comentario == undefined    || avaliacao.comentario.length > 150    ||
               avaliacao.data_avaliacao=='' || avaliacao.data_avaliacao==undefined  ||avaliacao.data_avaliacao==null        ||
               avaliacao.id == ''     || avaliacao.id == undefined      || avaliacao.id == null           || isNaN(avaliacao.id)    ||
               avaliacao.id_usuario == ''   || avaliacao.id_usuario == undefined    || avaliacao.id_usuario == null         || isNaN(avaliacao.id_usuario)) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let resultAvaliacao = await avaliacaoDAO.insertAvaliacao(avaliacao)
                
                if(resultAvaliacao)
                    return message.SUCCESS_CREATED_ITEM
                else
                    return message.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarAvaliacao = async function(id, avaliacao, contentType) {
    try {
        if(String(contentType).toLowerCase() == 'application/json') {
            if(id_avaliacao == '' || id_avaliacao == undefined || id_avaliacao == null || isNaN(id_avaliacao) || id_avaliacao <= 0 ||
               avaliacao.nota == '' || avaliacao.nota == undefined || avaliacao.nota == null || avaliacao.nota.length > 5 ||
               avaliacao.comentario==''     || avaliacao.comentario == undefined    || avaliacao.comentario.length > 150    ||
               avaliacao.data_avaliacao=='' || avaliacao.data_avaliacao==undefined  ||avaliacao.data_avaliacao==null        ||
               avaliacao.id == '' || avaliacao.id == undefined || avaliacao.id == null || isNaN(avaliacao.id) ||
               avaliacao.id_usuario == '' || avaliacao.id_usuario == undefined || avaliacao.id_usuario == null || isNaN(avaliacao.id_usuario)) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let resultAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(parseInt(id_avaliacao))
                
                if(resultAvaliacao != false || typeof(resultAvaliacao) == 'object') {
                    if(resultAvaliacao.length > 0) {
                        avaliacao.id = parseInt(id_avaliacao)
                        let result = await avaliacaoDAO.updateAvaliacao(avaliacao)
                        
                        if(result)
                            return message.SUCCESS_UPDATED_ITEM
                        else
                            return message.ERROR_INTERNAL_SERVER_MODEL
                    } else {
                        return message.ERROR_NOT_FOUND
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirAvaliacao = async function(id_avaliacao) {
    try {
        if(id_avaliacao == '' || id_avaliacao == undefined || id_avaliacao == null || isNaN(id_avaliacao) || id_avaliacao <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let resultAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(parseInt(id_avaliacao))
            
            if(resultAvaliacao != false || typeof(resultAvaliacao) == 'object') {
                if(resultAvaliacao.length > 0) {
                    let result = await avaliacaoDAO.deleteAvaliacao(parseInt(id_avaliacao))
                    
                    if(result)
                        return message.SUCCESS_DELETED_ITEM
                    else
                        return message.ERROR_INTERNAL_SERVER_MODEL
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarAvaliacao = async function() {
    try {
        let arrayAvaliacoes = []
        let dadosAvaliacao = {}
        
        let resultAvaliacao = await avaliacaoDAO.selectAllAvaliacao()
        
        if(resultAvaliacao != false || typeof(resultAvaliacao) == 'object') {
            if(resultAvaliacao.length > 0) {
                dadosAvaliacao.status = true
                dadosAvaliacao.status_code = 200
                dadosAvaliacao.items = resultAvaliacao.length
                
                for(const itemAvaliacao of resultAvaliacao) {
                    let dadosFilme = await controllerFilme.buscarFilme(itemAvaliacao.id)
                    let dadosUsuario = await controllerUsuario.buscarUsuario(itemAvaliacao.id_usuario)
                    
                    itemAvaliacao.filme = dadosFilme.films[0]
                    itemAvaliacao.usuario = dadosUsuario.usuario
                    
                    delete itemAvaliacao.id
                    delete itemAvaliacao.id_usuario
                    
                    arrayAvaliacoes.push(itemAvaliacao)
                }
                
                dadosAvaliacao.avaliacoes = arrayAvaliacoes
                
                return dadosAvaliacao
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarAvaliacao = async function(id_avaliacao) {
    try {
        let arrayAvaliacoes = []
        
        if(id_avaliacao == '' || id_avaliacao == undefined || id_avaliacao == null || isNaN(id_avaliacao) || id_avaliacao <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            dadosAvaliacao = {}
            
            let resultAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(parseInt(id_avaliacao))
            
            if(resultAvaliacao != false || typeof(resultAvaliacao) == 'object') {
                if(resultAvaliacao.length > 0) {
                    dadosAvaliacao.status = true
                    dadosAvaliacao.status_code = 200
                    
                    for(const itemAvaliacao of resultAvaliacao) {
                        let dadosFilme = await controllerFilme.buscarFilme(itemAvaliacao.id)
                        let dadosUsuario = await controllerUsuario.buscarUsuario(itemAvaliacao.id_usuario)
                        
                        itemAvaliacao.filme = dadosFilme.films[0]
                        itemAvaliacao.usuario = dadosUsuario.usuario
                        
                        delete itemAvaliacao.id
                        delete itemAvaliacao.id_usuario
                        
                        arrayAvaliacoes.push(itemAvaliacao)
                    }
                    
                    dadosAvaliacao.avaliacoes = arrayAvaliacoes
                    
                    return dadosAvaliacao
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirAvaliacao,
    atualizarAvaliacao,
    excluirAvaliacao,
    listarAvaliacao,
    buscarAvaliacao
}