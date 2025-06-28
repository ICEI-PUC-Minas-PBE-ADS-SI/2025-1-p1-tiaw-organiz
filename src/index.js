
const express = require("express")
const fs = require("fs").promises
const path = require("path")
const cors = require("cors")

const app = express()
const PORT = 3000
const DB_PATH = path.join(__dirname, "db", "db.json")


app.use(cors())
app.use(express.json({ limit: "10mb" })) 
app.use(express.static(path.join(__dirname, "public")))

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erro ao ler banco de dados:", error)
    return { usuarios: [], dados_usuarios: {} }
  }
}


async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("Erro ao escrever no banco de dados:", error)
    return false
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body
    const db = await readDB()

    const usuario = db.usuarios.find((u) => u.email === email && u.senha === senha)

    if (usuario) {
      
      const { senha: _, ...usuarioSemSenha } = usuario
      res.json({
        success: true,
        message: "Login realizado com sucesso!",
        usuario: usuarioSemSenha,
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Email ou senha incorretos!",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
})


app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome, sobrenome, username, email, senha } = req.body
    const db = await readDB()

   
    const emailExiste = db.usuarios.find((u) => u.email === email)
    if (emailExiste) {
      return res.status(400).json({
        success: false,
        message: "Este email já está cadastrado!",
      })
    }

  
    const usernameExiste = db.usuarios.find((u) => u.login === username)
    if (usernameExiste) {
      return res.status(400).json({
        success: false,
        message: "Este nome de usuário já está em uso!",
      })
    }

   
    const novoUsuario = {
      id: generateId(),
      nome: `${nome} ${sobrenome}`,
      email,
      senha,
      login: username,
      telefone: "",
      dataNascimento: "",
      fotoPerfil: "",
      createdAt: new Date().toISOString(),
    }

    db.usuarios.push(novoUsuario)


    db.dados_usuarios[novoUsuario.id] = {
      pastas: [],
      metas: [],
      configuracoes: {
        tema: "light",
        ultimaAtualizacao: new Date().toISOString(),
      },
    }

    await writeDB(db)

   
    const { senha: _, ...usuarioSemSenha } = novoUsuario
    res.json({
      success: true,
      message: "Usuário registrado com sucesso!",
      usuario: usuarioSemSenha,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
})


app.get("/api/user/:userId/profile", async (req, res) => {
  try {
    const { userId } = req.params
    const db = await readDB()

    const usuario = db.usuarios.find((u) => u.id === userId)
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      })
    }

    
    const { senha: _, ...usuarioSemSenha } = usuario
    res.json({
      success: true,
      usuario: usuarioSemSenha,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
})


app.put("/api/user/:userId/profile", async (req, res) => {
  try {
    const { userId } = req.params
    const { nome, email, telefone, dataNascimento, fotoPerfil, senhaAtual, novaSenha } = req.body
    const db = await readDB()

    const usuarioIndex = db.usuarios.findIndex((u) => u.id === userId)
    if (usuarioIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      })
    }

    const usuario = db.usuarios[usuarioIndex]

    
    if (novaSenha) {
      if (!senhaAtual || usuario.senha !== senhaAtual) {
        return res.status(400).json({
          success: false,
          message: "Senha atual incorreta",
        })
      }
      usuario.senha = novaSenha
    }

   
    if (email !== usuario.email) {
      const emailExiste = db.usuarios.find((u) => u.email === email && u.id !== userId)
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: "Este email já está em uso por outro usuário",
        })
      }
    }

  
    usuario.nome = nome
    usuario.email = email
    usuario.telefone = telefone || ""
    usuario.dataNascimento = dataNascimento || ""
    if (fotoPerfil) {
      usuario.fotoPerfil = fotoPerfil
    }
    usuario.updatedAt = new Date().toISOString()

    await writeDB(db)

  
    const { senha: _, ...usuarioSemSenha } = usuario
    res.json({
      success: true,
      message: "Perfil atualizado com sucesso!",
      usuario: usuarioSemSenha,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
})

app.get("/api/user/:userId/data", async (req, res) => {
  try {
    const { userId } = req.params
    const db = await readDB()

    const dadosUsuario = db.dados_usuarios[userId]
    if (!dadosUsuario) {
      return res.status(404).json({
        success: false,
        message: "Dados do usuário não encontrados",
      })
    }

    res.json({
      success: true,
      data: dadosUsuario,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
})


app.post("/api/user/:userId/data", async (req, res) => {
  try {
    const { userId } = req.params
    const { data } = req.body
    const db = await readDB()

    
    db.dados_usuarios[userId] = {
      ...data,
      configuracoes: {
        ...data.configuracoes,
        ultimaAtualizacao: new Date().toISOString(),
      },
    }

    await writeDB(db)

    res.json({
      success: true,
      message: "Dados salvos com sucesso!",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    })
  }
})


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "registro.html"))
})


app.listen(PORT, () => {
  console.log(`🚀 Servidor OrganiZ rodando em http://localhost:${PORT}`)
  console.log(`📁 Banco de dados: ${DB_PATH}`)
})
