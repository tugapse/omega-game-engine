import { ClassType } from "../enums/class-type.enum";
import { ClassMetadata } from "../interfaces/class-metadata";

/**
 * A static utility class that provides dependency injection and object instantiation services.
 * It allows registering classes with a string key and then creating instances of them dynamically,
 * often from serialized JSON data.
 */
export class ObjectInstanciator {
  /**
   * A map that stores dependency injection functions (constructors or factories) for instantiating classes.
   * @private
   */
  private static dependecies: { [key: string]: Function } = {};
  /**
   * A map that stores metadata associated with registered classes, used for discovery in tools like an editor.
   * @private
   */
  private static metadata: { [key: string]: ClassMetadata } = {};

  /**
   * Adds a class constructor or factory function as a dependency for instantiation.
   * This allows the class to be created later using its string name.
   *
   * @param className - The name of the class to register.
   * @param func - The constructor or factory function to be called for instantiation.
   * @param metadata - Optional metadata about the class.
   */
  public static addDependency(className: string, func: Function, metadata?: ClassMetadata): void {
    ObjectInstanciator.dependecies[className] = func;
    if (metadata) {
      ObjectInstanciator.metadata[className] = metadata;
    }
  }

  /**
   * Retrieves the registered constructor or factory function for a given class name.
   *
   * @param className - The name of the class.
   * @returns The registered function.
   * @throws If the dependency for the class name is not found.
   */
  public static getDependency(className: string): Function {
    const dep = ObjectInstanciator.dependecies[className];
    if (!dep) {
      throw new Error(`Dependency not found for class: ${className}`);
    }
    return dep;
  }

  /**
   * Instantiates an object from a registered class name.
   * This is the core function for deserializing objects from data.
   *
   * @template T The expected type of the instantiated object.
   * @param className - The name of the class to instantiate.
   * @param args - Optional arguments to pass to the constructor/factory function.
   * @returns A new instance of the specified class, or `undefined` if the class is not registered.
   */
  public static instanciateObjectFromJsonData<T>(className: string, args?: any[]): T | undefined {
    if (this.dependecies[className]) {
      if (args && args.length > 0) {
        return this.dependecies[className](...args) as T;
      } else {
        return this.dependecies[className]() as T;
      }
    } else {
      console.warn(`[ObjectInstanciator] Class not found! Implement Class instancing for: ${className}`);
    }
    return undefined;
  }

  /**
   * Retrieves metadata for classes, optionally filtered by one or more class types.
   * 
   * @param types - A single class type or an array of class types to filter by. If omitted, all metadata is returned.
   * @returns An array of metadata objects matching the specified types.
   */
  public static getMetadata(types?: ClassType | ClassType[]): ClassMetadata[] {
    const allMetadata = Object.values(ObjectInstanciator.metadata);
    if (!types) {
      return allMetadata;
    }
    const typesArray = Array.isArray(types) ? types : [types];
    return allMetadata.filter(meta => typesArray.includes(meta.type));
  }
}