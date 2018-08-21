'use strict';

const InvocationContainer = require('addict-ioc').InvocationContainer;
const logger = require('loggerhythm').Logger.createLogger('test:bootstrapper');
const path = require('path');

const iocModuleNames = [
  '@essential-projects/bootstrapper',
  '@essential-projects/bootstrapper_node',
  '@essential-projects/event_aggregator',
  '@essential-projects/http_extension',
  '@essential-projects/services',
  '@essential-projects/timing',
  '@process-engine/consumer_api_core',
  '@process-engine/consumer_api_http',
  '@process-engine/deployment_api_core',
  '@process-engine/deployment_api_http',
  '@process-engine/flow_node_instance.repository.sequelize',
  '@process-engine/heatmap_poc_kpi_api',
  '@process-engine/heatmap_poc_logging_api',
  '@process-engine/heatmap_poc_logging.repository.file_system',
  '@process-engine/heatmap_poc_metrics_api',
  '@process-engine/heatmap_poc_token_history_api',
  '@process-engine/iam',
  '@process-engine/management_api_core',
  '@process-engine/management_api_http',
  '@process-engine/process_engine',
  '@process-engine/process_model.repository.sequelize',
  '@process-engine/timers.repository.sequelize',
];

const iocModules = iocModuleNames.map((moduleName) => {
  return require(`${moduleName}/ioc_module`);
});

let container;

async function start() {

  try {
    container = new InvocationContainer({
      defaults: {
        conventionCalls: ['initialize'],
      },
    });

    for (const iocModule of iocModules) {
      iocModule.registerInContainer(container);
    }

    container.validateDependencies();

    const appPath = path.resolve(__dirname);
    console.log(appPath);
    const bootstrapper = await container.resolveAsync('AppBootstrapper', [appPath]);

    logger.info('Bootstrapper started.');

    await bootstrapper.start();
  } catch (error) {
    logger.error('Failed to start bootstrapper!', error);
    throw error;
  }
}

start();
