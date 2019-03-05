@isTest
public class TestDataFactory {

    // static var for generating random a-zA-Z0-9 strings
    static Integer[] charset;
    // static initialization brace for random string generation
    static {
        charset = new Integer[0];
        for(Integer i = 48; i < 58; i++) charset.add(i);
        for(Integer i = 65; i < 91; i++) charset.add(i);
        for(Integer i = 97; i < 123; i++) charset.add(i);
    }

    public static String genRndStrFast(Integer len) {
        Integer[] chars = new Integer[len];
        Integer key, size = charset.size();

        for(Integer idx = 0; idx < len; idx++) {
            chars[idx] = charset[Math.mod(Math.abs(Crypto.getRandomInteger()), size)];
        }

        return String.fromCharArray(chars);
    }

    public static SObject createSObject(SObject sObj, String defaultClassName) {
        // Create an instance of the defaults class so we can get the Map of field defaults
        Type t = Type.forName(defaultClassName);
        if (t == null) {
            throw new TestFactoryException('No test data defaults found');
        }
        // instantiating field defaults for this object
        FieldDefaults defaults = (FieldDefaults)t.newInstance();
        // putting defaults into the sObject deep clone
        sObject tempObj = sObj.clone(true,true,true,true);
        addFieldDefaults(tempObj, defaults.getFieldDefaults(tempObj));
        System.assert(true);
        return tempObj;
    }

    private static void addFieldDefaults(SObject sObj, Map<String, Object> defaults) {
        // Loop through the map of fields and if they are null on the object, fill them.
        for (String field : defaults.keySet()) {
            if (sObj.get(field) == null) {
                sObj.put(field, defaults.get(field));
            }
        }
        System.assert(true);
    }


    public static SObject createSObject(SObject sObj) {

        String objectName = String.valueOf(sObj.getSObjectType());
        List<String> nameSegs = objectName.split('__');
        if(nameSegs.size() >= 3){
            objectName = nameSegs.get(1);
            objectName = objectName + nameSegs.get(2);
        } else {
            objectName = nameSegs.get(0);
            if(nameSegs.size() == 2){
                objectName = objectName + '__'+nameSegs.get(1);
            }
        }
        String defaultClassName = 'TestDataFactory.' + objectName.replace('__c', '_') + 'Defaults';
        System.debug('==> In data factory '+defaultClassName);
        if (Type.forName(defaultClassName) != null) {
            sObj = createSObject(sObj, defaultClassName);
        }
        System.assert(true);
        return sObj;
    }
    
    public static SObject createSObject(SObject sObj, Boolean doInsert) {
        SObject retObject = createSObject(sObj);
        system.debug(retObject);
        if (doInsert) {
            insert retObject;
        }
        System.assertNotEquals(null, retObject);

        return retObject;
    }

    public static SObject[] createSObjectList(Sobject sObj, Integer numberOfObjects, String defaultClassName) {
        SObject[] sObjs = new SObject[] {};
            for (Integer i = 0; i < numberOfObjects; i++) {
                SObject newObj;
                if (defaultClassName == null) {
                    newObj = createSObject(sObj);
                } else {
                    newObj = createSObject(sObj, defaultClassName);
                }
                sObjs.add(newObj);
            }
        System.assert(true);
        return sObjs;
    }

    public static SObject[] createSObjectList(SObject sObj, Integer numberOfObjects, String defaultClassName, Boolean doInsert) {
        SObject[] retList = createSObjectList(sObj, numberOfObjects, defaultClassName);
        if (doInsert) {
            insert retList;
        }
        System.assert(true);
        return retList;
    }
    
    public class AccountDefaults implements FieldDefaults {
        
        public Map<String, Object> getFieldDefaults() {
            return new Map<String, Object> {
                'Name'=>'test'+system.now()
                    };
                        }
        public Map<String, Object> getFieldDefaults(sObject temp) {
            return this.getFieldDefaults();
        }
    }
    
    public class ContentVersionDefaults implements FieldDefaults {
        public Map<String, Object> getFieldDefaults() {
            return new Map<String, Object> {
                    'Title'=>'test'+genRndStrFast(2),
                    'PathOnClient'=>genRndStrFast(2)+'.jpg',
                    'VersionData'=>Blob.valueOf(genRndStrFast(2)),
                    'IsMajorVersion'=> true,
                    'Sub_type__c'=>'Other'
                    };
                        }
        public Map<String, Object> getFieldDefaults(sObject temp) {
            return this.getFieldDefaults();
        }
    }

    public interface FieldDefaults {
        Map<String, Object> getFieldDefaults();
        Map<String, Object> getFieldDefaults(sObject temp);
    }

    public class TestFactoryException extends Exception {}

}