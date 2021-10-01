
	IF NOT EXISTS(SELECT 1 FROM [dbo].[Menus] WHERE [MenuName] = 'AuditMaster')
  BEGIN
  INSERT INTO [dbo].[Menus]([MenuName],[MenuText],[MenuIconName],[IsDeleted],[CreatedBy]
      ,[CreatedDate])
SELECT 'AuditMaster','Audit Master', 'AuditMaster', 0, 'Admin', GETDATE()

END

IF NOT EXISTS(SELECT 1 FROM [dbo].[AppMenus] WHERE [MenuName] = 'AuditMaster')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'MAINMENU','Master','AuditMaster',ISNULL((SELECT MAX(SortOrder) FROM [dbo].[AppMenus] ),  1), 0, 'Admin', GETDATE()
END

IF NOT EXISTS(SELECT * FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'CreateNew')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'CONTEXTMENU','AuditMaster','CreateNew',0, 0, 'Admin', GETDATE()
END

IF NOT EXISTS(SELECT * FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'Delete')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'CONTEXTMENU','AuditMaster','Delete',0, 0, 'Admin', GETDATE()
END

IF NOT EXISTS(SELECT * FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'Edit')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'CONTEXTMENU','AuditMaster','Edit',0, 0, 'Admin', GETDATE()
END

IF NOT EXISTS(SELECT * FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'View')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'CONTEXTMENU','AuditMaster','View',0, 0, 'Admin', GETDATE()
END

IF NOT EXISTS(SELECT * FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'Release')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'CONTEXTMENU','AuditMaster','Release',0, 0, 'Admin', GETDATE()
END

DECLARE @AppMenuID INT = ISNULL((SELECT ID FROM [dbo].[AppMenus] WHERE [MenuName] = 'AuditMaster'),0)
IF NOT EXISTS(SELECT 1 FROM [dbo].[AppRoleMenus] WHERE [AppMenuID] = @AppMenuID)
BEGIN

  INSERT INTO [dbo].[AppRoleMenus]([RoleName]
      ,[ApplicationID]
      ,[AppMenuID]
      ,[IsDeleted]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[CompanyID])
	  SELECT 'DEFAULT', 'FATWEBUI',@AppMenuID,0, 'Admin',GETDATE(), 'Host'

END

SET @AppMenuID = ISNULL((SELECT ID FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'CreateNew'),0)

IF NOT EXISTS(SELECT 1 FROM [dbo].[AppRoleMenus] WHERE [AppMenuID] = @AppMenuID)
BEGIN

  INSERT INTO [dbo].[AppRoleMenus]([RoleName]
      ,[ApplicationID]
      ,[AppMenuID]
      ,[IsDeleted]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[CompanyID])
	  SELECT 'DEFAULT', 'FATWEBUI',@AppMenuID,0, 'Admin',GETDATE(), 'Host'

END

SET @AppMenuID = ISNULL((SELECT ID FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'Delete'),0)

IF NOT EXISTS(SELECT 1 FROM [dbo].[AppRoleMenus] WHERE [AppMenuID] = @AppMenuID)
BEGIN

  INSERT INTO [dbo].[AppRoleMenus]([RoleName]
      ,[ApplicationID]
      ,[AppMenuID]
      ,[IsDeleted]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[CompanyID])
	  SELECT 'DEFAULT', 'FATWEBUI',@AppMenuID,0, 'Admin',GETDATE(), 'Host'

END

SET @AppMenuID = ISNULL((SELECT ID FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'Edit'),0)

IF NOT EXISTS(SELECT 1 FROM [dbo].[AppRoleMenus] WHERE [AppMenuID] = @AppMenuID)
BEGIN

  INSERT INTO [dbo].[AppRoleMenus]([RoleName]
      ,[ApplicationID]
      ,[AppMenuID]
      ,[IsDeleted]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[CompanyID])
	  SELECT 'DEFAULT', 'FATWEBUI',@AppMenuID,0, 'Admin',GETDATE(), 'Host'

END

SET @AppMenuID = ISNULL((SELECT ID FROM [dbo].[AppMenus] WHERE [ParentMenuName] = 'AuditMaster' AND [MenuName] = 'View'),0)

IF NOT EXISTS(SELECT 1 FROM [dbo].[AppRoleMenus] WHERE [AppMenuID] = @AppMenuID)
BEGIN

  INSERT INTO [dbo].[AppRoleMenus]([RoleName]
      ,[ApplicationID]
      ,[AppMenuID]
      ,[IsDeleted]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[CompanyID])
	  SELECT 'DEFAULT', 'FATWEBUI',@AppMenuID,0, 'Admin',GETDATE(), 'Host'

END

	IF NOT EXISTS(SELECT 1 FROM [dbo].[Menus] WHERE [MenuName] = 'AuditMaster')
  BEGIN
  INSERT INTO [dbo].[Menus]([MenuName],[MenuText],[MenuIconName],[IsDeleted],[CreatedBy]
      ,[CreatedDate])
SELECT 'AuditMaster','Audit Master', 'AuditMaster', 0, 'Admin', GETDATE()

END

IF NOT EXISTS(SELECT 1 FROM [dbo].[AppMenus] WHERE [MenuName] = 'AuditReport')
BEGIN

INSERT INTO [dbo].[AppMenus]([ApplicationID]
    ,[MenuType]
    ,[ParentMenuName]
    ,[MenuName]
    ,[SortOrder]
    ,[IsDeleted]
    ,[CreatedBy]
    ,[CreatedDate])
SELECT 'FATWEBUI', 'MAINMENU','Reports','AuditReport',ISNULL((SELECT MAX(SortOrder) FROM [dbo].[AppMenus] ),  1), 0, 'Admin', GETDATE()
END

IF NOT EXISTS(SELECT 1 FROM [dbo].[Menus] WHERE [MenuName] = 'AuditReport')
BEGIN
  INSERT INTO [dbo].[Menus]([MenuName],[MenuText],[MenuIconName],[IsDeleted],[CreatedBy]
      ,[CreatedDate])
SELECT 'AuditReport','Audit Report', 'AuditReport', 0, 'Admin', GETDATE()

END

IF NOT EXISTS(SELECT 1 FROM [dbo].[Menus] WHERE [MenuName] = 'AuditReport')
BEGIN
  INSERT INTO [dbo].[Menus]([MenuName],[MenuText],[MenuIconName],[IsDeleted],[CreatedBy]
      ,[CreatedDate])
SELECT 'AuditReport','Audit Report', 'AuditReport', 0, 'Admin', GETDATE()

END

DECLARE @MenuID INT = ISNULL((SELECT ID FROM [dbo].[AppMenus] WHERE MenuName = 'AuditReport'), 0)

IF @MenuID <> 0
BEGIN
	IF NOT EXISTS(SELECT 1 FROM [dbo].[AppRoleMenus] WHERE AppMenuID = @MenuID AND RoleName = 1)
	BEGIN
		INSERT INTO [dbo].[AppRoleMenus]([RoleName],[ApplicationID],[AppMenuID],[IsDeleted]
			,[CreatedBy],[CreatedDate],[ModifiedBy],[ModifiedDate],[CompanyID])
		SELECT 1, 'FATWEBUI', @MenuID, 0, 'Admin', GETDATE(), NULL, NULL, 'HOST'
	END
END
