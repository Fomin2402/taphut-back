import { AppSyncResolverEvent, Callback, Context } from 'aws-lambda';

import { IFilter, IFilterRow, updateFilterById } from 'utils/filter';
import logger, { setDebugLevel } from 'utils/logger';
import { DynamoDB_CleanObj } from 'utils/dynamodb';

setDebugLevel(process.env.DEBUG_LEVEL || 'info');

/**
 * Handle a private GraphQL request to delete a user's filter.
 *
 * @param event
 * @param _context
 * @param callback
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function handler(
  event: AppSyncResolverEvent<{ chatId: string; filter: IFilter }>,
  _context: Context,
  callback: Callback<IFilterRow>
): Promise<void> {
  logger.info(`event is ${JSON.stringify(event)}`);
  const { chatId, filter } = event?.arguments || {};

  const cleanFilter = (DynamoDB_CleanObj(filter as any) as any) as IFilter;

  const updatedFilter: IFilterRow = await updateFilterById(chatId, cleanFilter);
  callback(null, updatedFilter);
}
