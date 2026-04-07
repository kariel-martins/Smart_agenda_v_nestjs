export function createAccount(url: string) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à nossa plataforma</title>
    <style>
        /* Estilos básicos para garantir responsividade */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #4f46e5;
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
            color: #333333;
        }
        .button-container {
            text-align: center;
            padding: 20px 0;
        }
        .button {
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Bem-vindo, [Nome]!</h1>
        </div>

        <div class="content">
            <p>Ficamos muito felizes em ter você conosco. Sua conta foi criada com sucesso e agora você tem acesso a todos os nossos recursos exclusivos.</p>
            
            <p>Para começar a explorar sua nova conta e configurar seu perfil, clique no botão abaixo:</p>
            
            <div class="button-container">
                <a href="${url}" class="button">Acessar Minha Conta</a>
            </div>

            <p>Se você tiver qualquer dúvida, basta responder a este e-mail. Nossa equipe de suporte está pronta para ajudar!</p>
            
            <p>Abraços,<br><strong>Equipe [Nome da Empresa]</strong></p>
        </div>

        <div class="footer">
            <p>&copy; 2026 mundo facil. Todos os direitos reservados.</p>
            <p>Você recebeu este e-mail porque se cadastrou em nossa plataforma.</p>
            <p><a href="#" style="color: #6b7280;">Sair da lista de transmissão</a></p>
        </div>
    </div>
</body>
</html>`
}

export function forgotPassword(url: string, userName: string) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recupere seu acesso</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .button-wrapper { text-align: center; margin: 30px 0; }
        .btn-primary { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px; }
        .link-fallback { font-size: 12px; color: #94a3b8; word-break: break-all; margin-top: 25px; }
        .footer { background-color: #f8fafc; padding: 25px; text-align: center; font-size: 12px; color: #64748b; }
        a { color: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span style="font-size: 24px; font-weight: bold; color: #1e293b;">Sua Logo</span>
        </div>

        <div class="content">
            <h2 style="margin-top: 0; color: #1e293b;">Solicitação de nova senha</h2>
            <p>Olá, ${userName}</p>
            <p>Recebemos uma solicitação para redefinir a senha associada a este e-mail. Se você fez essa solicitação, clique no botão abaixo para escolher uma nova senha:</p>
            
            <div class="button-wrapper">
                <a href="${url}" class="btn-primary">Redefinir Senha</a>
            </div>

            <p><strong>Por quanto tempo este link funciona?</strong><br>
            Este link expirará em 2 horas por motivos de segurança.</p>

            <p style="margin-bottom: 0;">Se o botão acima não funcionar, copie e cole o endereço abaixo no seu navegador:</p>
            <div class="link-fallback">
                ${url}
            </div>
        </div>

        <div class="footer">
            <p>Se você não solicitou a alteração da senha, ignore este e-mail com segurança. Sua senha atual não será alterada até que você acesse o link acima.</p>
            <p style="margin-top: 15px;">&copy; 2026 Sua Empresa Inc. <br> Rua Exemplo, 123 - Cidade, Estado.</p>
        </div>
    </div>
</body>
</html> `
}

export function resentPassword(url: string, userName: string) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefina sua senha</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #ef4444; /* Vermelho/Alerta suave */
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
            color: #333333;
        }
        .button-container {
            text-align: center;
            padding: 30px 0;
        }
        .button {
            background-color: #ef4444;
            color: #ffffff !important;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
        }
        .warning-box {
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 15px;
            margin-top: 20px;
            font-size: 14px;
            color: #9a3412;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Recuperação de Senha</h2>
        </div>

        <div class="content">
            <p>Olá, <strong>${userName}</strong>,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta em nossa plataforma. Se foi você, clique no botão abaixo para criar uma nova senha:</p>
            
            <div class="button-container">
                <a href="${url}" class="button">Redefinir Minha Senha</a>
            </div>

            <p>Este link é válido por apenas <strong>60 minutos</strong>. Após esse período, você precisará solicitar um novo link.</p>

            <div class="warning-box">
                <strong>Não foi você?</strong> Se você não solicitou a troca de senha, por favor, ignore este e-mail. Sua conta continua segura e nenhuma alteração foi feita.
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2026 Mundo fácil. Todos os direitos reservados.</p>
            <p>Enviado de forma automática. Por favor, não responda a este e-mail.</p>
        </div>
    </div>
</body>
</html>`
}
