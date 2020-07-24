import {
    Category,
    CategoryConfiguration,
    CategoryLogFormat,
    CategoryServiceFactory, DateFormat, DateFormatEnum,
    LoggerType,
    LogLevel
} from 'typescript-logging';

// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
const dateFormat = new DateFormat(DateFormatEnum.YearDayMonthTime, '.');
CategoryServiceFactory.setDefaultConfiguration(
    new CategoryConfiguration(
        LogLevel.Info,
        LoggerType.Console,
        new CategoryLogFormat(dateFormat, true, true)
    )
);

// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
export const serverLog = new Category('sever');
export const log = new Category('app');

// Optionally get a logger for a category, since 0.5.0 this is not necessary anymore, you can use the category itself to log.
// export const log: CategoryLogger = CategoryServiceFactory.getLogger(cat);
