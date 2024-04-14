import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import typeOrmConfig from '../../typeorm.config';
import { TestResolver } from '../resolver/test.resolver';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true
        }),
    ],
    providers: [TestResolver]
})

export class GraphQLModuleFile {}