# HeatmapPOC

The heatmap feature serves to visualize the performance of the processengine
and provides statistics about a ProcessModels usage and runtime.

## Motivation

This serves as a proof of concept for the further development of the "Heatmap".

## TL;DR

```bash
npm install && npm run build && npm test
```

## Setup

### Backend

To install dependencies:

`npm install`

To build the project:

`npm run build`

Now, either startup the backend:

`npm start`

Or run the tests:

`npm test`

### Frontend

>
> TODO
>

## Usage

### Backend

Startup the backend as described above.

The application provides an endpoint against which to make requests that will
allow you to call the heatmap related functions.

The routes are as follows:
  - Get the runtime information for a ProcessModel:
  `GET /process_model/:process_model_id/runtime_information`
  - Get the currently active tokens for a ProcessModel:
  `GET /process_model/:process_model_id/active_tokens`
  - Get the runtime information for a FlowNode:
  `GET /process_model/:process_model_id/flow_node/:flow_node_id/runtime_information`
  - Get the active tokens on a FlowNode:
  `GET /flow_node/:flow_node_id/active_tokens`
  - Get all the logs for a ProcessModel:
  `GET /correlation/:correlation_id/process_model/:process_model_id/logs`
  - Get the token history for a FlowNode:
  `GET /correlation/:correlation_id/process_model/:process_model_id/flow_node/:flow_node_id/token_history`

### Fronted

>
> TODO
>
