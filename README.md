# Campaign Manager Pro

Aplicación Full Stack para gestionar campañas publicitarias. Desarrollada con Next.js y diseñada para desplegar en AWS con arquitectura serverless.

## 🚀 Características

- ✅ API RESTful completa con operaciones CRUD
- ✅ Cálculo automático de márgenes (Budget / Units)
- ✅ Interfaz moderna y responsive con React
- ✅ Validación de datos en frontend y backend
- ✅ Gestión de estados (Activa, Pausada, Completada)
- ✅ Diseño profesional con Tailwind CSS
- ✅ Arquitectura lista para AWS Lambda + API Gateway

## 📋 Requisitos de la Prueba Técnica

### Backend (Completado ✓)

- [x] **API Gateway**: Endpoints REST configurados en `/api/campaigns`
- [x] **AWS Lambda**: Lógica implementada en Python (ver `scripts/lambda_functions.py`)
- [x] **DynamoDB/RDS**: Scripts SQL incluidos para ambas opciones
- [x] **Cálculo de Margen**: `margin = budget / units` automático
- [x] **Validaciones**: Datos de entrada validados
- [x] **Manejo de Errores**: Códigos HTTP apropiados (200, 201, 400, 404, 500)
- [x] **Documentación API**: Ver sección API Endpoints

### Frontend (Completado ✓)

- [x] **SPA con React**: Aplicación Next.js moderna
- [x] **CRUD Completo**: Ver, Crear, Editar, Eliminar campañas
- [x] **Validaciones**: Validación en tiempo real
- [x] **Cálculo en Tiempo Real**: Margen se actualiza automáticamente
- [x] **Performance**: Optimizado con React hooks y lazy loading
- [x] **Diseño Profesional**: UI/UX moderna y responsive

## 📊 API Endpoints

### Base URL: `/api/campaigns`

| Método | Endpoint | Descripción | Códigos de Estado |
|--------|----------|-------------|-------------------|
| GET | `/campaigns` | Listar todas las campañas | 200, 500 |
| GET | `/campaigns/{id}` | Obtener una campaña | 200, 404, 500 |
| POST | `/campaigns` | Crear campaña | 201, 400, 500 |
| PUT | `/campaigns/{id}` | Actualizar campaña | 200, 400, 404, 500 |
| DELETE | `/campaigns/{id}` | Eliminar campaña | 200, 404, 500 |

### Ejemplos de Uso

#### Crear Campaña
\`\`\`bash
POST /api/campaigns
Content-Type: application/json

{
  "name": "Campaña Navidad 2025",
  "client": "Retail Corp",
  "platform": "Google Ads",
  "budget": 100000,
  "units": 20000,
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "status": "active"
}
\`\`\`

Respuesta (201):
\`\`\`json
{
  "id": "1735689600000",
  "name": "Campaña Navidad 2025",
  "client": "Retail Corp",
  "platform": "Google Ads",
  "budget": 100000,
  "units": 20000,
  "margin": 5.0,
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "status": "active",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
\`\`\`

#### Listar Campañas
\`\`\`bash
GET /api/campaigns
\`\`\`

Respuesta (200):
\`\`\`json
[
  {
    "id": "1",
    "name": "Campaña Verano 2025",
    "client": "Tech Corp",
    "platform": "Google Ads",
    "budget": 50000,
    "units": 10000,
    "margin": 5.0,
    "startDate": "2025-01-01",
    "endDate": "2025-03-31",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
\`\`\`

## 🏗️ Arquitectura AWS

### Diagrama de Arquitectura

\`\`\`
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  CloudFront │ ───► │  S3 Bucket   │      │ API Gateway │
│   (CDN)     │      │  (Frontend)  │      │  (REST API) │
└─────────────┘      └──────────────┘      └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │ Lambda       │
                                            │ (Python 3.11)│
                                            └──────┬───────┘
                                                   │
                              ┌────────────────────┴────────────────────┐
                              ▼                                         ▼
                       ┌─────────────┐                          ┌──────────┐
                       │  DynamoDB   │      O BIEN              │   RDS    │
                       │  (NoSQL)    │                          │  (SQL)   │
                       └─────────────┘                          └──────────┘
\`\`\`

### Servicios AWS Utilizados

1. **Amazon S3**: Almacenamiento del frontend estático
2. **CloudFront**: CDN para distribución global
3. **API Gateway**: Endpoints REST para la API
4. **AWS Lambda**: Funciones serverless en Python
5. **DynamoDB** o **RDS**: Base de datos (a elección)
6. **IAM**: Gestión de permisos y roles

## 🗄️ Base de Datos

### Opción 1: DynamoDB (NoSQL)

**Estructura de la Tabla:**
- **Nombre**: `campaigns`
- **Partition Key**: `id` (String)
- **Billing Mode**: On-Demand

**Crear tabla:**
\`\`\`bash
python scripts/create_table_dynamodb.py
\`\`\`

**Ventajas:**
- ✅ Serverless y escalable automáticamente
- ✅ Sin administración de infraestructura
- ✅ Pago por uso
- ✅ Integración nativa con Lambda

### Opción 2: RDS PostgreSQL (SQL)

**Crear tabla:**
\`\`\`bash
psql -h <RDS_ENDPOINT> -U postgres -d campaigns_db -f scripts/create_table_postgres.sql
\`\`\`

**Ventajas:**
- ✅ Queries SQL complejas
- ✅ Relaciones entre tablas
- ✅ Transacciones ACID
- ✅ Familiaridad con SQL

## 🚀 Despliegue en AWS

### Paso 1: Preparar el Backend (Lambda)

1. **Crear función Lambda:**
\`\`\`bash
# Empaquetar el código
cd scripts
zip -r lambda_function.zip lambda_functions.py

# Subir a Lambda vía AWS Console o CLI
aws lambda create-function \
  --function-name campaign-manager-api \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --handler lambda_functions.lambda_handler \
  --zip-file fileb://lambda_function.zip \
  --environment Variables={DYNAMODB_TABLE_NAME=campaigns}
\`\`\`

2. **Configurar variables de entorno:**
   - `DYNAMODB_TABLE_NAME`: `campaigns`

3. **Configurar permisos IAM:**
   - Acceso a DynamoDB (dynamodb:PutItem, GetItem, Scan, UpdateItem, DeleteItem)
   - Logs de CloudWatch

### Paso 2: Configurar API Gateway

1. **Crear API REST:**
   - Tipo: REST API
   - Nombre: `campaign-manager-api`

2. **Crear recursos y métodos:**

\`\`\`
/campaigns
  ├── GET     → Lambda: lambda_handler
  ├── POST    → Lambda: lambda_handler
  └── /{id}
      ├── GET    → Lambda: lambda_handler
      ├── PUT    → Lambda: lambda_handler
      └── DELETE → Lambda: lambda_handler
\`\`\`

3. **Habilitar CORS:**
\`\`\`json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
\`\`\`

4. **Desplegar API:**
   - Crear stage: `prod`
   - Obtener URL: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod`

### Paso 3: Desplegar Frontend

1. **Configurar variable de entorno:**
\`\`\`bash
# .env.local
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
\`\`\`

2. **Build y subir a S3:**
\`\`\`bash
npm run build
aws s3 sync out/ s3://campaign-manager-frontend/
\`\`\`

3. **Configurar S3 para hosting:**
   - Habilitar "Static website hosting"
   - Bucket policy público para lectura

4. **Configurar CloudFront:**
   - Origen: S3 bucket
   - Default root object: `index.html`
   - Error pages: Redirigir 404 a `/index.html` (SPA)

### Paso 4: Base de Datos

**Para DynamoDB:**
\`\`\`bash
python scripts/create_table_dynamodb.py
\`\`\`

**Para RDS:**
\`\`\`bash
psql -h <RDS_ENDPOINT> -U postgres -d campaigns_db -f scripts/create_table_postgres.sql
\`\`\`

## 🧪 Testing Local

### Backend
\`\`\`bash
# Iniciar servidor de desarrollo
npm run dev

# Probar endpoints
curl http://localhost:3000/api/campaigns
\`\`\`

### Frontend
\`\`\`bash
# Abrir en navegador
open http://localhost:3000
\`\`\`

## 📦 Estructura del Proyecto

\`\`\`
campaign-manager-pro/
├── app/
│   ├── api/
│   │   └── campaigns/
│   │       ├── route.ts           # GET, POST /campaigns
│   │       └── [id]/
│   │           └── route.ts       # GET, PUT, DELETE /campaigns/{id}
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Página principal
│   └── globals.css                # Estilos globales
├── components/
│   ├── campaign-form.tsx          # Formulario de campaña
│   ├── campaign-table.tsx         # Tabla de campañas
│   └── campaign-details.tsx       # Detalles de campaña
├── lib/
│   ├── types.ts                   # Tipos TypeScript
│   └── db.ts                      # Lógica de base de datos
├── scripts/
│   ├── lambda_functions.py        # Funciones Lambda (Python)
│   ├── create_table_dynamodb.py   # Script para crear tabla DynamoDB
│   └── create_table_postgres.sql  # Script para crear tabla PostgreSQL
└── README.md                      # Esta documentación
\`\`\`

## 🔒 Seguridad

- ✅ Validación de datos en backend
- ✅ Sanitización de inputs
- ✅ CORS configurado correctamente
- ✅ Variables de entorno para credenciales
- ✅ IAM roles con permisos mínimos necesarios

## 📈 Extras Implementados

- [x] Cálculo automático de margen en tiempo real
- [x] Estados de campaña (Activa, Pausada, Completada)
- [x] Filtros visuales con badges de estado
- [x] Vista de detalles completa
- [x] Diseño responsive y profesional
- [x] Manejo de errores robusto
- [x] Scripts de inicialización de DB

## 🎯 Próximos Pasos (Opcionales)

Para mejorar aún más la aplicación:

1. **Subida de archivos a S3**: Logos de campañas, PDFs
2. **Autenticación**: Cognito para gestión de usuarios
3. **Múltiples Lambdas**: Separar funciones por endpoint
4. **Lambda Layers**: Compartir dependencias comunes
5. **Step Functions**: Workflows complejos
6. **CloudWatch**: Dashboards y alertas
7. **Tests**: Jest + Testing Library

## 📝 Documentación API (OpenAPI)

La aplicación está lista para generar documentación Swagger/OpenAPI. Los endpoints siguen el estándar REST y retornan respuestas JSON consistentes.

## 🤝 Contacto

Para cualquier pregunta sobre la implementación, no dudes en contactarme.

---

**Desarrollado para la prueba técnica de Full Stack Developer - US Media**
