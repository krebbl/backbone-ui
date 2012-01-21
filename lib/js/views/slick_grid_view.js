(function() {

	Backbone.Model.prototype.toSlickItem = function() {
		var item = {};
		_.extend(item, this.attributes);
		var self = this;

		// fetch all getter methods and set value;
		for(var k in this) {
			if(k.length > 3) {
				var fn = this[k];
				if(_.isFunction(fn)) {
					var i = k.indexOf("get");
					if(i > -1) {
						
						var key = k.substr(3);
						key = key[0].toLowerCase() + key.substr(1);
						item[key] = this[k]();
					}
				}
			}
		}

		return item;
	}

	UI.SlickGridView = UI.View.extend({
		defaultOptions : {
			// the default key for the item id
			itemIdKey : "id",
			selection : new Backbone.Collection(),
			columns : [],
			loadingMaskSelector : '.slick-viewport'
		},
		// register this view to listen to the collection events
		bindModelEvents : function() {
			if(this.collection) {
				this.collection.bind('change', this.onChange, this);
				this.collection.bind('add', this.onAddModel, this);
				this.collection.bind('remove', this.onRemoveModel, this);
				this.collection.bind('reset', this.onCollectionReset, this);
				this.collection.bind('fetch', this.showLoadingMask, this);
				this.collection.bind('dataFetched', this.hideLoadingMask, this);
			}
		},
		// render the content of this view
		renderContent : function() {
			console.log("Render Content");
			var selection = this.options.selection;

			var self = this;
			var dataView = new Slick.Data.DataView();
			if(this.collection) {
				this.options.items = [];
				this.collection.each(function(model) {
					self.options.items.push(model.toSlickItem());
				});
			}

			dataView.setItems(this.options.items);

			var collection = this.collection;

			// slick grid config
			var config = {
				enableAsyncPostRender : true,
				asyncPostRenderDelay : 10,
				forceFitColumns : true,
				multiSelect : true
			}

			// _.extend(config, this.options);

			var selectedRowIds = [];

			var grid = new Slick.Grid(this.$el, dataView.rows, this.options.columns, config);
			// this.grid.setSelectionModel(new Slick.RowSelectionModel());

			grid.onSelectedRowsChanged = function() {
				selectedRowIds = [];
				selectedModels = [];
				var rows = grid.getSelectedRows();
				for(var i = 0, l = rows.length; i < l; i++) {
					var item = dataView.rows[rows[i]];
					if(item) {
						selectedRowIds.push(item.id);
						selectedModels.push(collection.get(item.id));
					}
				}
				selection.reset(selectedModels);
			};

			grid.onKeyDown = function(e, currentRow) {
				self.trigger('keyDown', e, self.collection.get(dataView.rows[currentRow][self.options.itemIdKey]));
				return false;
			};

			grid.onSort = function(sortCol, sortAsc) {
				sortdir = sortAsc ? 1 : -1;
				sortcol = sortCol.field;

				// use numeric sort of % and lexicographic for everything else
				dataView.fastSort((sortCol.sortFn) ? sortCol.sortFn : sortcol, sortAsc);
			};

			grid.onDblClick = function(e, row) {
				self.trigger('doubleClick', self.collection.get(dataView.rows[row][self.options.itemIdKey], e));
				return true;
			}

			grid.onClick = function(e, row) {
				self.trigger('click', self.collection.get(dataView.rows[row][self.options.itemIdKey], e));
				return false;
			}

			dataView.onRowsChanged.subscribe(function(rows) {
				grid.removeRows(rows);
				grid.render();

				if(selectedRowIds.length > 0) {
					// since how the original data maps onto rows has changed,
					// the selected rows in the grid need to be updated
					var selRows = [];
					for(var i = 0; i < selectedRowIds.length; i++) {
						var idx = dataView.getRowById(selectedRowIds[i]);
						if(idx != undefined) {
							selRows.push(idx);
						}
					}

					grid.setSelectedRows(selRows);
				}
			});

			grid.onContextMenu = function(e, row, cell) {
				grid.setSelectedRows([row]);
				return true;
			}
			this.dataView = dataView;
			this.grid = grid;

			this.renderLoadingMask("Lade Daten ...");
			this.unbind('afterShow');
			this.bind('afterShow', function() {
				self.afterShow();
			});
			this.unbind('beforeHide');
			this.bind('beforeHide', function() {
				self.beforeHide();
			});
		},
		resizeContent : function() {
			/// console.log("on table resize");
			// this.grid.resizeCanvas();
		},
		createColumns : function() {
			var slickColumns = [];
			_.each(this.options.columns, function(col) {
				var slickCol = col;
				var pi = col.field.indexOf(".");
				if(pi > 0) {

					var keys = col.field.split(".");
					var sortFn = function() {
						var v = this;
						for(var i = 0; i < keys.length && !_.isUndefined(v) && v != null; i++) {
							v = v[keys[i]];
						};
						if(!_.isUndefined(v) && v != null) {
							return v.toString().toLowerCase();
						}
						return "";
					}
					var keys2 = col.field.split(".");
					var field = keys2.shift();
					var formatFn = col.formatter;
					var formatter = function(r, c, v) {
						for(var i = 0; i < keys2.length && !_.isUndefined(v) && v != null; i++) {
							v = v[keys2[i]];
						};
						if(formatFn) {
							return formatFn(r, c, v);
						}
						return v;
					}
					slickCol["field"] = field;
					slickCol["formatter"] = formatter;
					slickCol["sortFn"] = sortFn;
				}

				slickColumns.push(slickCol);

			});
			return slickColumns;
		},
		_getItemId : function(item) {
			if(this._isModelItem(item))
				return item.get(itemIdKey);
			return item[itemIdKey];
		},
		_getItemData : function(item) {
			if(this._isModelItem(item))
				return item.toSlickItem();
			return item;
		},
		_isModelItem : function(item) {
			return _.isFunction(item.toJSON);
		},
		onChange : function(model) {
			// console.log("SLICKGRID CHANGE EVENT")
			this.dataView.beginUpdate();
			this.dataView.updateItem(model.get(this.options.itemIdKey), model.toSlickItem());
			this.dataView.endUpdate();
		},
		onCollectionReset : function() {
			var items = [];
			this.collection.each(function(model) {
				items.push(model.toSlickItem());
			});
			this.dataView.beginUpdate();
			this.dataView.setItems(items);
			this.dataView.endUpdate();
		},
		onAddModel : function(model) {
			this.dataView.beginUpdate();
			this.dataView.addItem(model.toSlickItem());
			this.dataView.endUpdate();
		},
		onRemoveModel : function(model) {
			this.dataView.beginUpdate();
			this.dataView.deleteItem(model.get(this.options.itemIdKey));
			this.dataView.endUpdate();
		},
		// item to the view
		addItem : function(item) {
			this.dataView.beginUpdate();
			this.dataView.addItem(this._getItemData(item));
			this.dataView.endUpdate();
		},
		// remove item from view
		removeItem : function(item) {
			this.dataView.beginUpdate();
			this.dataView.deleteItem(this._getItemId(item));
			this.dataView.endUpdate();
		},
		// set an array of items to the view
		setItems : function(items) {
			this.dataView.beginUpdate();
			this.dataView.setItems(items);
			this.dataView.endUpdate();
		},
		updateItem : function(item) {
			this.dataView.beginUpdate();
			this.dataView.updateItem(this._getItemId(item), this._getItemValue(item));
			this.dataView.endUpdate();
		},
		// returns the number of list items
		getSize : function() {
			return this.collection.size();
		},
		getSelectedItems : function() {
			return this.selection.models;
		},
		getSelection : function() {
			return this.selection;
		},
		afterShow : function() {
			var self = this;
			window.setTimeout(function() {
				self.$el.find('.slick-viewport').scrollTop(self.scrollTop);
			}, 400);
		},
		beforeHide : function() {
			var viewport = this.$el.find('.slick-viewport').first();
			this.scrollTop = viewport.scrollTop();
		},
		focus: function(){
			this.$el.find('.grid-canvas').focus();
		}
	});

	// Mixin
	_.extend(UI.SlickGridView.prototype, UI.LoadingMask);

})();
