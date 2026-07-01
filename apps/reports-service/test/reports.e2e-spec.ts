import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as http from 'http';

describe('Reports Integration Tests (WireMock simulation)', () => {
  let app: INestApplication<App>;
  let mockServer: http.Server;
  let mockResponseBody: any = [];
  let mockResponseStatus = 200;

  beforeAll((done) => {
    // Iniciamos un servidor mock local en el puerto 8089 para simular WireMock
    mockServer = http.createServer((req, res) => {
      res.writeHead(mockResponseStatus, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockResponseBody));
    });
    mockServer.listen(8089, done);
  });

  afterAll((done) => {
    mockServer.close(done);
  });

  beforeEach(async () => {
    // Forzar la URL de orders-service a nuestro servidor mock local
    process.env.ORDERS_SERVICE_URL = 'http://localhost:8089/orders';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('debe generar el reporte agregando ventas de ordenes pagadas', async () => {
    // Stub de WireMock para respuesta exitosa
    mockResponseStatus = 200;
    mockResponseBody = [
      { id: 1, total: '150.00', status: 'PAGADO' },
      { id: 2, total: '250.50', status: 'PAGADO' },
      { id: 3, total: '99.99', status: 'PENDIENTE' },
    ];

    const response = await request(app.getHttpServer())
      .get('/sales-reports')
      .expect(200);

    expect(response.body).toEqual({
      totalSales: 400.5,
      totalOrders: 2,
    });
  });

  it('debe retornar 500 si el servidor de ordenes falla', async () => {
    // Stub de WireMock para respuesta fallida
    mockResponseStatus = 500;
    mockResponseBody = { message: 'Internal Server Error' };

    await request(app.getHttpServer())
      .get('/sales-reports')
      .expect(500);
  });
});
